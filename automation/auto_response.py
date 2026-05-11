import json
import time
import random

processed_alerts = set()

print("\nSentinelZero Automated Response Engine Running...\n")

while True:

    try:

        with open("../logs/alerts.json", "r") as file:

            alerts = json.load(file)

            for alert in alerts:

                alert_id = alert["timestamp"]

                if alert_id not in processed_alerts:

                    processed_alerts.add(alert_id)

                    if alert["severity"] == "HIGH":

                        fake_ip = f"192.168.1.{random.randint(1, 255)}"

                        response = {

                            "timestamp": alert["timestamp"],
                            "action": "Blocked malicious IP",
                            "ip": fake_ip,
                            "threat": alert["log"]

                        }

                        print(f"[AUTO RESPONSE] Blocked IP: {fake_ip}")

                        try:

                            with open("../logs/responses.json", "r") as response_file:
                                responses = json.load(response_file)

                        except:

                            responses = []

                        responses.append(response)

                        with open("../logs/responses.json", "w") as response_file:
                            json.dump(responses, response_file, indent=4)

                        try:

                            with open("../logs/blocked_ips.json", "r") as blocked_file:
                                blocked_ips = json.load(blocked_file)

                        except:

                            blocked_ips = []

                        blocked_ips.append({

                            "ip": fake_ip,
                            "timestamp": alert["timestamp"]

                        })

                        with open("../logs/blocked_ips.json", "w") as blocked_file:
                            json.dump(blocked_ips, blocked_file, indent=4)

    except Exception as e:

        print(e)

    time.sleep(3)