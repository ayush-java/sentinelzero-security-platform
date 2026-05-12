import boto3

ec2 = boto3.client("ec2")

response = ec2.describe_instances()

print("\nRunning EC2 Instances:\n")

for reservation in response["Reservations"]:

    for instance in reservation["Instances"]:

        print(f"""
Instance ID: {instance['InstanceId']}
State: {instance['State']['Name']}
Type: {instance['InstanceType']}
""")