import random
import time
from datetime import datetime

attack_messages = [

    "Failed MFA login attempt",
    "Unauthorized admin access attempt",
    "Privilege escalation detected",
    "Suspicious login from foreign IP",
    "Multiple failed SSH logins",
    "IAM permission policy violation",
    "Blocked malicious IP address",
    "Potential brute force attack detected"

]

while True:

    attack = random.choice(attack_messages)

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    log_entry = f"[{timestamp}] ALERT: {attack}\n"

    print(log_entry)

    with open("../logs/security_logs.txt", "a") as file:
        file.write(log_entry)

    time.sleep(5)