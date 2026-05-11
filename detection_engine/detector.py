import time
import json
from datetime import datetime

HIGH_THREATS = [

    "Privilege escalation detected",
    "Potential brute force attack detected",
    "Unauthorized admin access attempt"

]

MEDIUM_THREATS = [

    "Multiple failed SSH logins",
    "Failed MFA login attempt"

]

LOW_THREATS = [

    "IAM permission policy violation",
    "Blocked malicious IP address",
    "Suspicious login from foreign IP"

]

print("\nSentinelZero Detection Engine Running...\n")

processed_logs = set()

while True:

    with open("../logs/security_logs.txt", "r") as file:

        logs = file.readlines()

        for log in logs:

            if log not in processed_logs:

                processed_logs.add(log)

                severity = "LOW"

                for threat in HIGH_THREATS:

                    if threat in log:
                        severity = "HIGH"

                for threat in MEDIUM_THREATS:

                    if threat in log:
                        severity = "MEDIUM"

                alert = {

                    "timestamp": str(datetime.now()),
                    "severity": severity,
                    "log": log.strip()

                }

                print(f"[{severity}] {log.strip()}")

                try:

                    with open("../logs/alerts.json", "r") as alert_file:
                        existing_alerts = json.load(alert_file)

                except:

                    existing_alerts = []

                existing_alerts.append(alert)

                with open("../logs/alerts.json", "w") as alert_file:
                    json.dump(existing_alerts, alert_file, indent=4)

    time.sleep(3)