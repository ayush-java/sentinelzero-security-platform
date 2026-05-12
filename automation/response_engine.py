import json
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

ALERTS_FILE = BASE_DIR / "logs" / "alerts.json"
RESPONSES_FILE = BASE_DIR / "logs" / "responses.json"
BLOCKED_IPS_FILE = BASE_DIR / "logs" / "blocked_ips.json"


def load_json(path):

    if not path.exists():
        return []

    try:
        with open(path, "r") as file:
            return json.load(file)
    except:
        return []


def save_json(path, data):

    with open(path, "w") as file:
        json.dump(data, file, indent=4)


alerts = load_json(ALERTS_FILE)

responses = load_json(RESPONSES_FILE)

blocked_ips = load_json(BLOCKED_IPS_FILE)


for alert in alerts:

    log = alert["log"]

    already_exists = any(
        response["threat"] == log
        for response in responses
    )

    if already_exists:
        continue

    if "Privilege escalation" in log:

        action = {
            "timestamp": str(datetime.now()),
            "threat": log,
            "action": "Admin account temporarily locked"
        }

        responses.append(action)

    elif "brute force" in log:

        action = {
            "timestamp": str(datetime.now()),
            "threat": log,
            "action": "Malicious IP automatically blocked"
        }

        blocked_ips.append({
            "ip": "192.168.1.45",
            "timestamp": str(datetime.now())
        })

        responses.append(action)

    elif "MFA" in log:

        action = {
            "timestamp": str(datetime.now()),
            "threat": log,
            "action": "Forced MFA reset initiated"
        }

        responses.append(action)


save_json(RESPONSES_FILE, responses)

save_json(BLOCKED_IPS_FILE, blocked_ips)

print("Automated responses generated successfully")