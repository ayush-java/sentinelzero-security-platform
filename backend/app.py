from flask import Flask
from flask import jsonify
from flask_cors import CORS

import json
from datetime import datetime

app = Flask(__name__)

CORS(app)

@app.route("/")

def home():

    return jsonify({

        "project": "SentinelZero",
        "status": "running",
        "message": "Zero Trust Security Platform Backend Active",
        "time": str(datetime.now())

    })

@app.route("/threats")

@app.route("/responses")

def responses():

    try:

        with open("../logs/responses.json", "r") as file:

            responses = json.load(file)

            latest_responses = responses[-10:]

            return jsonify(list(reversed(latest_responses)))

    except Exception as e:

        return jsonify({

            "error": str(e)

        })

def threats():

    try:

        with open("../logs/alerts.json", "r") as file:

            alerts = json.load(file)

            latest_alerts = alerts[-10:]

            formatted_alerts = []

            for alert in reversed(latest_alerts):

                formatted_alerts.append({

                    "severity": alert["severity"],
                    "message": alert["log"],
                    "time": alert["timestamp"]

                })

            return jsonify(formatted_alerts)

    except Exception as e:

        return jsonify({

            "error": str(e)

        })

if __name__ == "__main__":

    app.run(debug=True)