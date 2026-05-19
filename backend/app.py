from flask import Flask, request, jsonify
from flask_cors import CORS

import requests
import boto3
import json
import os
import time
import bcrypt
import urllib.parse
import urllib.request


from pathlib import Path
from datetime import datetime, timedelta

from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)

# ---------------------------------------------------
# APP CONFIG
# ---------------------------------------------------

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "sentinelzero_super_secret_jwt_key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=12)

jwt = JWTManager(app)

CORS(
    app,
    resources={r"/*": {"origins": "*"}}
)

# ---------------------------------------------------
# RECAPTCHA
# ---------------------------------------------------

RECAPTCHA_SECRET_KEY = "6Ld2xeUsAAAAABNQdQHjzPWXJ58SZnb1Q7EN1yWx"

RECAPTCHA_VERIFY_URL = (
    "https://www.google.com/recaptcha/api/siteverify"
)

# ---------------------------------------------------
# DEFAULT LOGIN
# ---------------------------------------------------

ADMIN_USERNAME = "admin"

ADMIN_PASSWORD = "sentinel123"

# ---------------------------------------------------
# PATHS
# ---------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

LOGS_DIR = BASE_DIR / "logs"

USERS_FILE = BASE_DIR / "users.json"

ALERTS_FILE = LOGS_DIR / "alerts.json"

RESPONSES_FILE = LOGS_DIR / "responses.json"

BLOCKED_IPS_FILE = LOGS_DIR / "blocked_ips.json"

AUTH_LOGS_FILE = LOGS_DIR / "auth_logs.json"


LOGS_DIR.mkdir(exist_ok=True)

ALERTS_FILE.touch(exist_ok=True)
RESPONSES_FILE.touch(exist_ok=True)
BLOCKED_IPS_FILE.touch(exist_ok=True)
AUTH_LOGS_FILE.touch(exist_ok=True)

FAILED_LOGIN_ATTEMPTS = {}

MAX_FAILED_ATTEMPTS = 5

LOCKOUT_TIME_SECONDS = 300

# ---------------------------------------------------
# VERIFY CAPTCHA
# ---------------------------------------------------

def verify_recaptcha_token(token):

    if not token:

        return False, "Missing CAPTCHA token"

    payload = urllib.parse.urlencode({

        "secret": RECAPTCHA_SECRET_KEY,
        "response": token

    }).encode("utf-8")

    try:

        req = urllib.request.Request(

            RECAPTCHA_VERIFY_URL,
            data=payload,
            method="POST"

        )

        with urllib.request.urlopen(req, timeout=8) as resp:

            verify_data = json.loads(
                resp.read().decode("utf-8")
            )

        if verify_data.get("success"):

            return True, "ok"

        return False, "CAPTCHA verification failed"

    except Exception:

        return False, "Unable to verify CAPTCHA"


def require_role(required_role):

    current_user = get_jwt_identity()

    if not current_user:

        return False

    return current_user.get("role") == required_role


def log_auth_event(event, username, role, ip):

    if not AUTH_LOGS_FILE.exists():

        with open(AUTH_LOGS_FILE, "w") as f:

            json.dump([], f)

    with open(AUTH_LOGS_FILE, "r") as f:

        content = f.read().strip()

        logs = json.loads(content) if content else []

    logs.append({

        "timestamp": str(datetime.now()),

        "event": event,

        "username": username,

        "role": role,

        "ip": ip

    })

    logs = logs[-200:]

    with open(AUTH_LOGS_FILE, "w") as f:

        json.dump(logs, f, indent=4)

# ---------------------------------------------------
# HOME
# ---------------------------------------------------

@app.route("/")
def home():

    return {"status": "backend working"}

# ---------------------------------------------------
# VERIFY CAPTCHA ROUTE
# ---------------------------------------------------

@app.route("/verify-captcha", methods=["POST"])
def verify_captcha():

    data = request.json

    captcha_token = data.get("token")

    payload = {

        "secret": RECAPTCHA_SECRET_KEY,

        "response": captcha_token

    }

    response = requests.post(

        "https://www.google.com/recaptcha/api/siteverify",

        data=payload

    )

    result = response.json()

    return jsonify({

        "success": result.get("success", False)

    })

# ---------------------------------------------------
# CREATE ACCOUNT
# ---------------------------------------------------

@app.route("/create-account", methods=["POST"])
def create_account():

    data = request.get_json(silent=True) or {}

    email = data.get("email")

    password = data.get("password")

    if not email or not password:

        return jsonify({

            "success": False,

            "message": "Email and password required"

        }), 400

    if not USERS_FILE.exists():

        with open(USERS_FILE, "w") as f:

            json.dump([], f)

    with open(USERS_FILE, "r") as f:

        users = json.load(f)

    for user in users:

        if user["email"] == email:

            return jsonify({

                "success": False,

                "message": "Account already exists"

            }), 400

    hashed_password = bcrypt.hashpw(

        password.encode("utf-8"),

        bcrypt.gensalt()

    ).decode("utf-8")

    users.append({

        "email": email,

        "password": hashed_password

    })

    with open(USERS_FILE, "w") as f:

        json.dump(users, f, indent=4)

    return jsonify({

        "success": True,

        "message": "Account created successfully"

    })

# ---------------------------------------------------
# LOGIN
# ---------------------------------------------------

@app.route("/login", methods=["POST"])
def login():

    payload = request.get_json(silent=True) or {}

    username = payload.get("username", "")

    client_ip = request.remote_addr

    current_time = time.time()

    if client_ip in FAILED_LOGIN_ATTEMPTS:

        attempts = FAILED_LOGIN_ATTEMPTS[client_ip]

        if attempts["count"] >= MAX_FAILED_ATTEMPTS:

            elapsed = current_time - attempts["last_attempt"]

            if elapsed < LOCKOUT_TIME_SECONDS:

                remaining = int(
                    LOCKOUT_TIME_SECONDS - elapsed
                )

                return jsonify({

                    "success": False,

                    "message": f"Too many failed attempts. Try again in {remaining} seconds."

                }), 429

            else:

                FAILED_LOGIN_ATTEMPTS.pop(client_ip)

    password = payload.get("password", "")

    users_file = USERS_FILE

    if not os.path.exists(users_file):

        return jsonify({
            "success": False,
            "message": "No users found"
        }), 401

    with open(users_file, "r") as f:

        users = json.load(f)

    for user in users:

        if user["email"] == username:

            if bcrypt.checkpw(

                password.encode("utf-8"),

                user["password"].encode("utf-8")

            ):

                access_token = create_access_token(
                    identity=user["email"]
                )

                if client_ip in FAILED_LOGIN_ATTEMPTS:

                    FAILED_LOGIN_ATTEMPTS.pop(client_ip)

                log_auth_event(

                    "SUCCESSFUL_LOGIN",

                    username,

                    "user",

                    client_ip

                )

                return jsonify({

                    "success": True,

                    "message": "Login successful",

                    "token": access_token,

                    "role": "user",

                    "email": user["email"]

                })

    if client_ip not in FAILED_LOGIN_ATTEMPTS:

        FAILED_LOGIN_ATTEMPTS[client_ip] = {

            "count": 0,

            "last_attempt": current_time

        }

    FAILED_LOGIN_ATTEMPTS[client_ip]["count"] += 1

    FAILED_LOGIN_ATTEMPTS[client_ip]["last_attempt"] = current_time

    log_auth_event(

        "FAILED_LOGIN",

        username,

        "unknown",

        client_ip

    )

    return jsonify({

        "success": False,

        "message": "Invalid credentials"

    }), 401


@app.route("/guest-login", methods=["POST"])
def guest_login():

    print("GUEST LOGIN BYPASS ENABLED")

    guest_token = create_access_token(
        identity={
            "username": "guest",
            "role": "guest"
        }
    )

    return jsonify({
        "success": True,
        "token": guest_token,
        "role": "guest"
    })

# ---------------------------------------------------
# THREATS
# ---------------------------------------------------

@app.route("/threats")
@jwt_required()
def threats():

    try:

        if not ALERTS_FILE.exists():

            return jsonify([])

        with open(ALERTS_FILE, "r") as file:

            alerts = json.load(file)

        latest_alerts = alerts[-100:]

        formatted_alerts = []

        for alert in reversed(latest_alerts):

            severity = "LOW"

            if "label" in alert:

                label = str(alert["label"]).upper()

                if label != "BENIGN":

                    severity = "HIGH"

            elif "severity" in alert:

                severity = alert["severity"]

            message = (

                alert.get("log")

                or alert.get("message")

                or alert.get("attack")

                or alert.get("label")

                or "Unknown Threat"

            )

            timestamp = (

                alert.get("timestamp")

                or alert.get("time")

                or str(datetime.now())

            )

            formatted_alerts.append({

                "severity": severity,

                "message": message,

                "time": timestamp

            })

        return jsonify(formatted_alerts)

    except Exception as e:

        return jsonify({

            "error": str(e)

        })

# ---------------------------------------------------
# RESPONSES
# ---------------------------------------------------

@app.route("/responses")
@jwt_required()
def responses():

    try:

        if not RESPONSES_FILE.exists():

            return jsonify([])

        with open(RESPONSES_FILE, "r") as file:

            responses = json.load(file)

        return jsonify(list(reversed(responses[-10:])))

    except Exception as e:

        return jsonify({

            "error": str(e)

        })

# ---------------------------------------------------
# BLOCKED IPS
# ---------------------------------------------------

@app.route("/blocked-ips")
@jwt_required()
def blocked_ips():

    try:

        if not BLOCKED_IPS_FILE.exists():

            return jsonify([])

        with open(BLOCKED_IPS_FILE, "r") as file:

            data = json.load(file)

        return jsonify(data)

    except Exception:

        return jsonify([])

# ---------------------------------------------------
# AWS STATUS
# ---------------------------------------------------

@app.route("/aws-status")
@jwt_required()
def aws_status():

    try:

        ec2 = boto3.client("ec2")

        response = ec2.describe_instances()

        instance_count = 0

        regions = set()

        for reservation in response["Reservations"]:

            for instance in reservation["Instances"]:

                instance_count += 1

                regions.add(

                    instance["Placement"]["AvailabilityZone"]

                )

        return jsonify({

            "instances": instance_count,

            "regions": list(regions),

            "security_groups": 14,

            "threat_alerts": 6

        })

    except Exception as e:

        return jsonify({

            "instances": 1,

            "regions": ["us-east-1"],

            "security_groups": 14,

            "threat_alerts": 6,

            "error": str(e)

        })


@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():

    current_user = get_jwt_identity()

    return jsonify({

        "logged_in_as": current_user

    })


@app.route("/admin-only", methods=["GET"])
@jwt_required()
def admin_only():

    if not require_role("user"):

        return jsonify({

            "success": False,

            "message": "Access denied"

        }), 403

    return jsonify({

        "success": True,

        "message": "Admin access granted"

    })


@app.route("/auth-logs")
@jwt_required()
def auth_logs():

    if not AUTH_LOGS_FILE.exists():

        return jsonify([])

    with open(AUTH_LOGS_FILE, "r") as f:

        content = f.read().strip()

        logs = json.loads(content) if content else []

    return jsonify(list(reversed(logs[-100:])))

# ---------------------------------------------------
# RUN APP
# ---------------------------------------------------

port = int(os.environ.get("PORT", 5001))

if __name__ == "__main__":

    app.run(host="0.0.0.0", port=port)



application = app
