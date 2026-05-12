import pandas as pd
import json
import random
import time
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent.parent

DATASET_FILE = BASE_DIR / "datasets" / "cicids2017" / "cicids.csv"

LOGS_DIR = BASE_DIR / "logs"

ALERTS_FILE = LOGS_DIR / "alerts.json"

# ---------------------------------------------------
# CREATE LOGS DIRECTORY IF IT DOESN'T EXIST
# ---------------------------------------------------

LOGS_DIR.mkdir(exist_ok=True)

# ---------------------------------------------------
# REALISTIC ATTACK TYPES
# ---------------------------------------------------

attack_types = [

    "DDoS",
    "Port Scan",
    "Brute Force",
    "Botnet",
    "Infiltration",
    "Web Attack",
    "SQL Injection",
    "XSS Attack",
    "Credential Stuffing",
    "Suspicious PowerShell",
    "Privilege Escalation",
    "Unauthorized Access Attempt",
    "Malware Beaconing",
    "Lateral Movement",
    "Remote Code Execution"

]

# ---------------------------------------------------
# COUNTRIES
# ---------------------------------------------------

countries = [

    "United States",
    "Germany",
    "Singapore",
    "Canada",
    "India",
    "Brazil",
    "Japan",
    "United Kingdom",
    "Australia"

]

# ---------------------------------------------------
# DESTINATION PORTS
# ---------------------------------------------------

destination_ports = [

    22,
    80,
    443,
    3389,
    8080,
    3306,
    5432,
    21,
    25,
    53

]

print("Loading CICIDS2017 dataset...")

df = pd.read_csv(DATASET_FILE)

print("Dataset loaded successfully")

# ---------------------------------------------------
# FILTER ONLY MALICIOUS TRAFFIC
# ---------------------------------------------------

attack_rows = df[df[" Label"] != "BENIGN"]

attack_rows = attack_rows.sample(min(1000, len(attack_rows)))

print(f"Loaded {len(attack_rows)} malicious rows")

# ---------------------------------------------------
# GENERATE LIVE ALERTS
# ---------------------------------------------------

def generate_alerts():

    generated_alerts = []

    sampled_rows = attack_rows.sample(min(120, len(attack_rows)))

    for _, row in sampled_rows.iterrows():

        dataset_label = str(row[" Label"])

        random_attack = random.choice(attack_types)

        # ---------------------------------------------------
        # SEVERITY LOGIC
        # ---------------------------------------------------

        if (

            "DDoS" in random_attack or
            "SQL" in random_attack or
            "RCE" in random_attack or
            "Privilege" in random_attack or
            "Malware" in random_attack

        ):

            severity = "HIGH"

        elif (

            "Port" in random_attack or
            "Botnet" in random_attack or
            "PowerShell" in random_attack or
            "Credential" in random_attack

        ):

            severity = "MEDIUM"

        else:

            severity = "LOW"

        # ---------------------------------------------------
        # GENERATE INTERNAL PRIVATE IPS
        # ---------------------------------------------------

        source_ip = (

            f"192.168.{random.randint(1,255)}.{random.randint(1,255)}"

        )

        destination_ip = (

            f"10.0.{random.randint(1,255)}.{random.randint(1,255)}"

        )

        destination_port = random.choice(destination_ports)

        country = random.choice(countries)

        protocol = random.choice([

            "TCP",
            "UDP",
            "HTTP",
            "HTTPS",
            "SSH",
            "DNS"

        ])

        # ---------------------------------------------------
        # ALERT OBJECT
        # ---------------------------------------------------

        alert = {

            "severity": severity,

            "message": f"{random_attack} detected from {source_ip}",

            "attack": random_attack,

            "dataset_label": dataset_label,

            "source_ip": source_ip,

            "destination_ip": destination_ip,

            "destination_port": destination_port,

            "country": country,

            "protocol": protocol,

            "time": str(datetime.now())

        }

        generated_alerts.append(alert)

    # ---------------------------------------------------
    # SAVE ALERTS
    # ---------------------------------------------------

    with open(ALERTS_FILE, "w") as file:

        json.dump(generated_alerts, file, indent=4)

    print(

        f"[{datetime.now()}] Generated {len(generated_alerts)} live attacks"

    )

# ---------------------------------------------------
# LIVE ATTACK LOOP
# ---------------------------------------------------

if __name__ == "__main__":

    while True:

        generate_alerts()

        time.sleep(5)