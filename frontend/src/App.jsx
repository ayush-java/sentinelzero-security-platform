import { useEffect, useState } from "react"
import axios from "axios"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import ReCAPTCHA from "react-google-recaptcha"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts"

function App() {

  const [backendData, setBackendData] = useState(null)

  const [liveThreats, setLiveThreats] = useState([])

  const [blockedIpsCount, setBlockedIpsCount] = useState(0)

  const [mfaAttempts, setMfaAttempts] = useState(0)

  const [threatLevel, setThreatLevel] = useState("Low")

  const [globalThreats, setGlobalThreats] = useState([])

  const [liveResponses, setLiveResponses] = useState([])

  const [threatData, setThreatData] = useState([])

  const [captchaVerified, setCaptchaVerified] = useState(false)

  const [responses, setResponses] = useState([])

  const [awsData, setAwsData] = useState(null)

  const [blockedIps, setBlockedIps] = useState([])

  const [activePage, setActivePage] = useState("dashboard")

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [role, setRole] = useState(localStorage.getItem("role") || "")
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  )
  const [showRegister, setShowRegister] = useState(false)
  const [showCreateAccount, setShowCreateAccount] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [createEmail, setCreateEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [captchaToken, setCaptchaToken] = useState(null)

  const [countries, setCountries] = useState([])

  const [attackChartData, setAttackChartData] = useState([])

  const [mfaData, setMfaData] = useState([])

  const [mfaEnabledUsers, setMfaEnabledUsers] = useState(94)

  const [privilegeAlerts, setPrivilegeAlerts] = useState(3)

  const [blockedAccounts, setBlockedAccounts] = useState(12)

  const [accessDeniedEvents, setAccessDeniedEvents] = useState(37)

  const [iamLogs, setIamLogs] = useState([])

  const [mfaComplianceData, setMfaComplianceData] = useState([])

  const [ec2Instances, setEc2Instances] = useState(1)

  const [vpcNetworks, setVpcNetworks] = useState(1)

  const [securityGroups, setSecurityGroups] = useState(14)

  const [cloudThreatAlerts, setCloudThreatAlerts] = useState(6)

  const [infrastructureHealth, setInfrastructureHealth] = useState([])

  const [cloudAuditLogs, setCloudAuditLogs] = useState([])

  const [openPorts, setOpenPorts] = useState([])

  const [regionTrafficData, setRegionTrafficData] = useState([])

  const [infrastructureUsageData, setInfrastructureUsageData] = useState([])

  const [cloudUsageData, setCloudUsageData] = useState([])

  const [infraHealth, setInfraHealth] = useState([])

  const [incidentStats, setIncidentStats] = useState([])

  const [incidentDistributionData, setIncidentDistributionData] = useState([])

  const [socAnalysts, setSocAnalysts] = useState([])

  const [mitreMappings, setMitreMappings] = useState([])

  const [detectionRules, setDetectionRules] = useState(128)

  const [threatFeeds, setThreatFeeds] = useState(12)

  const [apiIntegrations, setApiIntegrations] = useState(8)

  const [activeSessions, setActiveSessions] = useState(2)

  const [siemIntegrations, setSiemIntegrations] = useState([])

  const [systemHealthData, setSystemHealthData] = useState([])

  const [activeUserSessions, setActiveUserSessions] = useState([])

  const [securityConfigurations, setSecurityConfigurations] = useState([])

  const [attackCategories, setAttackCategories] = useState([])

  const COLORS = ["#00ff99", "#ff4d4d"]

  const [suspiciousUsers, setSuspiciousUsers] = useState([])

  const isGuest = role === "guest"
  const isRestrictedPage =
    isGuest && ["iam", "incidents", "settings"].includes(activePage)

  const sampleThreats = [
    {
      id: 1,
      type: "SSH Brute Force",
      severity: "High",
      ip: "192.168.1.45",
      status: "Blocked",
      detected: "Detected: 34 sec ago"
    },
    {
      id: 2,
      type: "SQL Injection Attempt",
      severity: "Critical",
      ip: "10.0.0.22",
      status: "Investigating",
      detected: "Detected: 2 mins ago"
    },
    {
      id: 3,
      type: "XSS Attack",
      severity: "Medium",
      ip: "172.16.0.10",
      status: "Resolved",
      detected: "Detected: 58 sec ago"
    },
    {
      id: 4,
      type: "Ransomware Activity",
      severity: "Critical",
      ip: "10.24.8.90",
      status: "Containment Initiated",
      detected: "Detected: 5 mins ago"
    },
    {
      id: 5,
      type: "Malware Beaconing",
      severity: "High",
      ip: "172.22.14.6",
      status: "Blocked",
      detected: "Detected: 1 min ago"
    },
    {
      id: 6,
      type: "Port Scanning",
      severity: "Low",
      ip: "203.0.113.76",
      status: "Monitoring",
      detected: "Detected: 4 mins ago"
    },
    {
      id: 7,
      type: "Credential Stuffing",
      severity: "High",
      ip: "198.51.100.19",
      status: "Blocked",
      detected: "Detected: 48 sec ago"
    },
    {
      id: 8,
      type: "Suspicious PowerShell",
      severity: "Medium",
      ip: "10.10.32.44",
      status: "Investigating",
      detected: "Detected: 3 mins ago"
    },
    {
      id: 9,
      type: "Unauthorized API Access",
      severity: "High",
      ip: "54.231.120.77",
      status: "Access Revoked",
      detected: "Detected: 27 sec ago"
    },
    {
      id: 10,
      type: "Privilege Escalation",
      severity: "Critical",
      ip: "172.31.255.3",
      status: "Escalated",
      detected: "Detected: 6 mins ago"
    },
    {
      id: 11,
      type: "DNS Tunneling",
      severity: "Medium",
      ip: "8.8.4.4",
      status: "Investigating",
      detected: "Detected: 2 mins ago"
    },
    {
      id: 12,
      type: "Reverse Shell Detection",
      severity: "Critical",
      ip: "185.199.108.153",
      status: "Blocked",
      detected: "Detected: 45 sec ago"
    },
    {
      id: 13,
      type: "Cloud IAM Abuse",
      severity: "High",
      ip: "52.95.110.14",
      status: "Investigating",
      detected: "Detected: 7 mins ago"
    },
    {
      id: 14,
      type: "MFA Fatigue Attack",
      severity: "Medium",
      ip: "34.201.77.40",
      status: "Resolved",
      detected: "Detected: 1 min ago"
    },
    {
      id: 15,
      type: "Data Exfiltration Attempt",
      severity: "Critical",
      ip: "192.0.2.88",
      status: "Containment Initiated",
      detected: "Detected: 9 mins ago"
    }
  ]

  const sampleReports = [
    {
      id: 1,
      title: "Brute Force Attack Detected",
      status: "Resolved",
      severity: "High"
    },
    {
      id: 2,
      title: "Suspicious IAM Activity",
      status: "Investigating",
      severity: "Critical"
    }
  ]

  const threatsFeedData =
    Array.isArray(liveThreats) && liveThreats.length > 0
      ? liveThreats
      : sampleThreats

  const reports =
    Array.isArray(incidentStats) && incidentStats.length > 0
      ? incidentStats
      : sampleReports

  const generateLiveData = () => {

    // -----------------------------------
    // BLOCKED IPS
    // -----------------------------------

    setBlockedIpsCount((prev) => {

      if (prev >= 9999) {

        return 0

      }

      return prev + Math.floor(Math.random() * 20)

    })

    // -----------------------------------
    // MFA ATTEMPTS
    // -----------------------------------

    setMfaAttempts((prev) => {

      if (prev >= 100) {

        return 0

      }

      return prev + Math.floor(Math.random() * 5)

    })

    // -----------------------------------
    // THREAT LEVEL
    // -----------------------------------

    const levels = [

      "Low",
      "Medium",
      "High"

    ]

    setThreatLevel(

      levels[Math.floor(Math.random() * levels.length)]

    )

    // -----------------------------------
    // GLOBAL THREATS
    // -----------------------------------

    setGlobalThreats([

      {

        country: "United States",
        attacks: Math.floor(Math.random() * 100),
        type: "Suspicious login attempts"

      },

      {

        country: "Germany",
        attacks: Math.floor(Math.random() * 50),
        type: "MFA bypass attempts"

      },

      {

        country: "Singapore",
        attacks: Math.floor(Math.random() * 30),
        type: "IAM policy violations"

      }

    ])

    // -----------------------------------
    // AUTOMATED RESPONSES
    // -----------------------------------

    const responseMessages = [

      "Blocked malicious IP",
      "Blocked malicious activity",
      "Potential brute force attack detected",
      "Unauthorized admin access attempt",
      "MFA bypass blocked",
      "Threat intelligence alert generated"

    ]

    const newResponses = Array.from({ length: 8 }, () => ({

      title: responseMessages[
        Math.floor(Math.random() * responseMessages.length)
      ],

      description: responseMessages[
        Math.floor(Math.random() * responseMessages.length)
      ],

      time: new Date().toLocaleTimeString()

    }))

    setLiveResponses(newResponses)

    // -----------------------------------
    // THREAT ACTIVITY GRAPH
    // -----------------------------------

    setThreatData([

      {

        time: "10AM",
        threats: Math.floor(Math.random() * 20)

      },

      {

        time: "11AM",
        threats: Math.floor(Math.random() * 20)

      },

      {

        time: "12PM",
        threats: Math.floor(Math.random() * 20)

      },

      {

        time: "1PM",
        threats: Math.floor(Math.random() * 20)

      },

      {

        time: "2PM",
        threats: Math.floor(Math.random() * 20)

      },

      {

        time: "3PM",
        threats: Math.floor(Math.random() * 20)

      }

    ])

    // -----------------------------------
    // IAM LIVE DATA
    // -----------------------------------

    setMfaEnabledUsers(

      85 + Math.floor(Math.random() * 15)

    )

    setPrivilegeAlerts(

      Math.floor(Math.random() * 10)

    )

    setBlockedAccounts(

      Math.floor(Math.random() * 40)

    )

    setAccessDeniedEvents(

      Math.floor(Math.random() * 120)

    )

    // -----------------------------------
    // IAM LOGS
    // -----------------------------------

    const iamActivities = [

      "User admin-root attempted AssumeRole escalation",
      "Failed AWS Console login detected",
      "IAM policy modified for EC2FullAccess",
      "Root account login detected",
      "MFA disabled attempt blocked",
      "Cross-account access detected",
      "New admin user created",
      "Unauthorized IAM API call blocked",
      "Access key rotated",
      "Suspicious AWS CLI activity detected"

    ]

    const generatedIamLogs = Array.from(

      { length: 5 },

      () => (

        iamActivities[
          Math.floor(Math.random() * iamActivities.length)
        ]

      )

    )

    setIamLogs(generatedIamLogs)

    // -----------------------------------
    // SUSPICIOUS USERS
    // -----------------------------------

    const riskLevels = [

      "HIGH",
      "MEDIUM",
      "LOW"

    ]

    const suspiciousActivities = [

      "Privilege escalation attempt",
      "Multiple failed logins",
      "Access from unusual location",
      "Suspicious AWS CLI usage",
      "Unauthorized S3 access",
      "Policy tampering detected"

    ]

    const users = [

      "admin-root",
      "temp-user-77",
      "external-contractor",
      "aws-service-account",
      "finance-admin",
      "cloud-ops-user"

    ]

    const generatedUsers = Array.from(

      { length: 4 },

      () => ({

        user: users[
          Math.floor(Math.random() * users.length)
        ],

        risk: riskLevels[
          Math.floor(Math.random() * riskLevels.length)
        ],

        activity: suspiciousActivities[
          Math.floor(Math.random() * suspiciousActivities.length)
        ],

        timestamp: `${Math.floor(Math.random() * 59)} mins ago`

      })

    )

    setSuspiciousUsers(generatedUsers)

    // -----------------------------------
    // MFA PIE CHART
    // -----------------------------------

    const enabled = 85 + Math.floor(Math.random() * 15)

    const disabled = 100 - enabled

    setMfaComplianceData([

      {

        name: "Enabled",
        value: enabled

      },

      {

        name: "Disabled",
        value: disabled

      }

    ])

    // --------------------------------------------------
    // CLOUD LIVE DATA
    // --------------------------------------------------

    setEc2Instances(Math.floor(Math.random() * 6) + 1)

    setVpcNetworks(Math.floor(Math.random() * 4) + 1)

    setSecurityGroups(Math.floor(Math.random() * 20) + 10)

    setCloudThreatAlerts(Math.floor(Math.random() * 15) + 1)

    setInfrastructureHealth([

      {
        service: "EC2",
        status: "Healthy"
      },

      {
        service: "RDS",
        status: Math.random() > 0.8 ? "Warning" : "Healthy"
      },

      {
        service: "Lambda",
        status: Math.random() > 0.6 ? "Warning" : "Healthy"
      },

      {
        service: "CloudFront",
        status: "Healthy"
      }

    ])

    setCloudAuditLogs([

      "EC2 instance rebooted in us-east-1",

      "Security group modified",

      "IAM role attached to Lambda function",

      "Unauthorized API call blocked",

      "S3 bucket policy updated",

      "CloudTrail event captured",

      "New VPC created",

      "GuardDuty threat detected"

    ].sort(() => 0.5 - Math.random()).slice(0, 5))

    setOpenPorts([

      {
        port: 22,
        service: "SSH",
        risk: "MEDIUM"
      },

      {
        port: 80,
        service: "HTTP",
        risk: "LOW"
      },

      {
        port: 443,
        service: "HTTPS",
        risk: "LOW"
      },

      {
        port: 3306,
        service: "MySQL",
        risk: "HIGH"
      }

    ])

    setInfrastructureUsageData([

      {
        time: "10AM",
        cpu: Math.floor(Math.random() * 40) + 20,
        memory: Math.floor(Math.random() * 40) + 40
      },

      {
        time: "11AM",
        cpu: Math.floor(Math.random() * 50) + 30,
        memory: Math.floor(Math.random() * 50) + 50
      },

      {
        time: "12PM",
        cpu: Math.floor(Math.random() * 60) + 40,
        memory: Math.floor(Math.random() * 60) + 60
      },

      {
        time: "1PM",
        cpu: Math.floor(Math.random() * 70) + 50,
        memory: Math.floor(Math.random() * 70) + 70
      },

      {
        time: "2PM",
        cpu: Math.floor(Math.random() * 60) + 40,
        memory: Math.floor(Math.random() * 60) + 60
      },

      {
        time: "3PM",
        cpu: Math.floor(Math.random() * 80) + 50,
        memory: Math.floor(Math.random() * 80) + 80
      }

    ])

    setRegionTrafficData([

      {
        region: "us-east-1",
        traffic: Math.floor(Math.random() * 100) + 50
      },

      {
        region: "us-west-2",
        traffic: Math.floor(Math.random() * 100) + 40
      },

      {
        region: "eu-central-1",
        traffic: Math.floor(Math.random() * 100) + 30
      },

      {
        region: "ap-southeast-1",
        traffic: Math.floor(Math.random() * 100) + 20
      }

    ])

    // --------------------------------------------------
    // INCIDENT REPORTS LIVE DATA
    // --------------------------------------------------

    setIncidentDistributionData([

      {
        name: "Resolved",
        value: Math.floor(Math.random() * 40) + 40
      },

      {
        name: "Investigating",
        value: Math.floor(Math.random() * 30) + 10
      },

      {
        name: "Escalated",
        value: Math.floor(Math.random() * 20) + 5
      }

    ])

    setMitreMappings([

      "T1110 - Brute Force",
      "T1078 - Valid Accounts",
      "T1021 - Remote Services",
      "T1562 - Defense Evasion",
      "T1059 - Command Execution",
      "T1046 - Network Service Discovery",
      "T1486 - Data Encryption Impact",
      "T1190 - Exploit Public-Facing App"

    ].sort(() => 0.5 - Math.random()).slice(0, 5))

    setSocAnalysts([

      {
        analyst: "A. Carter",
        incidents: Math.floor(Math.random() * 15) + 1,
        status: "Online"
      },

      {
        analyst: "J. Morgan",
        incidents: Math.floor(Math.random() * 10) + 1,
        status: "Investigating"
      },

      {
        analyst: "L. Patel",
        incidents: Math.floor(Math.random() * 8) + 1,
        status: "Online"
      }

    ])

    // --------------------------------------------------
    // SETTINGS LIVE DATA
    // --------------------------------------------------

    setDetectionRules(

      120 + Math.floor(Math.random() * 20)

    )

    setThreatFeeds(

      10 + Math.floor(Math.random() * 6)

    )

    setApiIntegrations(

      6 + Math.floor(Math.random() * 5)

    )

    setActiveSessions(

      1 + Math.floor(Math.random() * 4)

    )

    setSiemIntegrations([

      {
        name: "Slack Webhook",
        status: "Connected"
      },

      {
        name: "Microsoft Teams",
        status: "Connected"
      },

      {
        name: "Splunk SIEM",
        status: Math.random() > 0.7
          ? "Warning"
          : "Active"
      },

      {
        name: "VirusTotal API",
        status: Math.random() > 0.8
          ? "Disconnected"
          : "Connected"
      }

    ])

    setSystemHealthData([

      {
        service: "Detection Engine",
        status: "Operational"
      },

      {
        service: "Threat Intel Feed",
        status: Math.random() > 0.8
          ? "Warning"
          : "Operational"
      },

      {
        service: "Response Automation",
        status: Math.random() > 0.6
          ? "Warning"
          : "Operational"
      },

      {
        service: "Cloud Monitoring",
        status: "Operational"
      }

    ])

    setActiveUserSessions([

      {
        user: "admin@sentinelzero.io",
        ip: "192.168.1.12",
        location: "Richardson, TX"
      },

      {
        user: "ayush.velhal@sentinelzero.io",
        ip: "172.16.4.8",
        location: "Dallas, TX"
      }

    ])

    setSecurityConfigurations([

      {
        name: "Auto Response Engine",
        enabled: Math.random() > 0.2
      },

      {
        name: "Threat Intel Sync",
        enabled: true
      },

      {
        name: "MFA Enforcement",
        enabled: true
      },

      {
        name: "Suspicious Login Detection",
        enabled: Math.random() > 0.3
      },

      {
        name: "Cloud Audit Logging",
        enabled: true
      }

    ])

  }

  useEffect(() => {

    const fetchData = async () => {

      try {

        const homeResponse = await fetch("http://127.0.0.1:5001/")
        const homeData = await homeResponse.json()
        setBackendData(homeData)

        const authToken = localStorage.getItem("token") || token

        if (!authToken) {
          return
        }

        const blockedIpsResponse = await fetch("http://127.0.0.1:5001/blocked-ips", {

          headers: {

            Authorization: `Bearer ${authToken}`

          }

        })

        if (blockedIpsResponse.status === 401) {

          handleLogout()

          alert("Session expired")

          return

        }

        const blockedIpsData = await blockedIpsResponse.json()
        setBlockedIps(blockedIpsData)

        const threatsResponse = await fetch("http://127.0.0.1:5001/threats", {

          headers: {

            Authorization: `Bearer ${authToken}`

          }

        })

        if (threatsResponse.status === 401) {

          handleLogout()

          alert("Session expired")

          return

        }

        const threatsData = await threatsResponse.json()
        setLiveThreats(threatsData)

        const responsesResponse = await fetch("http://127.0.0.1:5001/responses", {

          headers: {

            Authorization: `Bearer ${authToken}`

          }

        })

        if (responsesResponse.status === 401) {

          handleLogout()

          alert("Session expired")

          return

        }

        const responsesData = await responsesResponse.json()
        setResponses(responsesData)

        const awsStatusResponse = await fetch("http://127.0.0.1:5001/aws-status", {

          headers: {

            Authorization: `Bearer ${authToken}`

          }

        })

        if (awsStatusResponse.status === 401) {

          handleLogout()

          alert("Session expired")

          return

        }

        const awsStatusData = await awsStatusResponse.json()
        setAwsData(awsStatusData)

      } catch (error) {

        console.log(error)

      }

    }

    fetchData()

    generateLiveData()

    verifySession()

    const interval = setInterval(() => {

      fetchData()

      generateLiveData()

    }, 5000)

    const sessionInterval = setInterval(() => {

      verifySession()

    }, 60000)

    return () => {

      clearInterval(interval)

      clearInterval(sessionInterval)

    }

  }, [])

  const handleLogin = async () => {

    console.log("HANDLE LOGIN RUNNING")

    try {

        const response = await fetch("http://127.0.0.1:5001/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        })

        const data = await response.json()

        console.log("LOGIN RESPONSE:", data)

        if (data.success) {

            localStorage.setItem("token", data.token)
            localStorage.setItem("role", data.role)

            setToken(data.token)
            setRole(data.role)
            setIsAuthenticated(true)

            alert("Login successful")

        } else {

            alert(data.message || "Login failed")

        }

    } catch (error) {

        console.error(error)
        alert("Backend connection failed")

    }

}

  const handleGuestAccess = async () => {

    console.log("HANDLE GUEST RUNNING")

    if (!captchaToken) {

        alert("Please complete CAPTCHA")
        return

    }

    try {

        const response = await fetch("http://127.0.0.1:5001/guest-login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                token: captchaToken
            })

        })

        const data = await response.json()

        console.log("GUEST RESPONSE:", data)

        if (data.success) {

            localStorage.setItem("token", data.token)
            localStorage.setItem("role", data.role)

            setToken(data.token)
            setRole(data.role)
            setIsAuthenticated(true)

            alert("Guest access granted")

        } else {

            alert(data.message || "Guest login failed")

        }

    } catch (error) {

        console.error(error)
        alert("Backend connection failed")

    }

}

  const handleLogout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("role")

    setToken("")
    setRole("")

    setIsAuthenticated(false)

    setUsername("")
    setPassword("")

  }

  const verifySession = async () => {

    if (!token) return

    try {

      const response = await fetch(
        "http://127.0.0.1:5001/protected",
        {

          headers: {

            Authorization: `Bearer ${token}`

          }

        }
      )

      if (response.status === 401) {

        handleLogout()

        alert("Session expired")

      }

    } catch (error) {

      console.log(error)

    }
  }

  const handleCreateAccount = async () => {

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/

    if (!strongPassword.test(newPassword)) {
      alert(
        "Password must be at least 12 characters with uppercase, lowercase, and special character"
      )
      return
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:5001/create-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: createEmail,
            password: newPassword,
          }),
        }
      )

      const data = await response.json()

      if (data.success) {

        alert("Account created successfully!")

        setShowCreateAccount(false)

        setCreateEmail("")
        setNewPassword("")
        setConfirmPassword("")

      } else {

        alert(data.message)

      }

    } catch (error) {

      console.error(error)
      alert("Backend connection failed")

    }
  }

  if (!isAuthenticated) {

    if (showCreateAccount || showRegister) {

      return (

        <div className="min-h-screen bg-black flex items-center justify-center p-6">

          <div className="w-full max-w-2xl bg-[#111118] border border-cyan-400 rounded-3xl p-10">

            <h1 className="text-6xl font-bold text-cyan-400 text-center">
              Create Account
            </h1>

            <p className="text-gray-400 text-center mt-4 mb-10">
              Secure Enterprise Registration
            </p>

            <div className="space-y-6">

              <input
                type="email"
                placeholder="Email"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-2xl p-6 text-white text-2xl"
              />

              <input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-2xl p-6 text-white text-2xl"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-2xl p-6 text-white text-2xl"
              />

              <button

                onClick={handleCreateAccount}

                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-2xl py-5 rounded-2xl"
              >

                Create Account

              </button>

              <button

                onClick={() => {
                  setShowCreateAccount(false)
                  setShowRegister(false)
                }}

                className="w-full border border-cyan-400 text-cyan-400 text-xl py-4 rounded-2xl"
              >

                Back to Login

              </button>

            </div>

          </div>

        </div>

      )

    }

    return (

      <div className="min-h-screen bg-black flex items-center justify-center p-6" style={{ pointerEvents: "auto" }}>

        <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-10 w-full max-w-md">

          <h1 className="text-4xl font-bold text-cyan-400 text-center">
            SentinelZero
          </h1>

          <p className="text-gray-400 text-center mt-3">
            Zero Trust Cloud Security Platform
          </p>

          <div className="mt-10 space-y-5">

            <div style={{ display: "none" }}>
              <input type="text" autoComplete="username" />
              <input type="password" autoComplete="current-password" />
            </div>

            <input
              type="text"
              name="fakeusernameremembered"
              autoComplete="off"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-4 text-white outline-none focus:border-cyan-500"
            />

            <input
              type="password"
              name="fakepasswordremembered"
              autoComplete="new-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-4 text-white outline-none focus:border-cyan-500"
            />

            <button
                type="button"
                onClick={() => {
                alert("LOGIN BUTTON WORKS")
                    handleLogin()
                }}
                style={{
                    width: "100%",
                    padding: "18px",
                    backgroundColor: "#11c5e8",
                    color: "black",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginTop: "20px",
                    position: "relative",
                    zIndex: 9999,
                    pointerEvents: "auto",
                }}
            >
                Login
            </button>

            <button
              onClick={() => {
                setShowRegister(true)
                setShowCreateAccount(true)
              }}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-lg transition"
            >
              Create Account
            </button>

            {
              loginError && (

                <p className="text-red-400 text-center">
                  {loginError}
                </p>

              )
            }

            <div className="mt-10 text-center">

              <h2 className="text-2xl font-bold text-cyan-400">
                Demo Guest Access
              </h2>

              <p className="text-gray-400 mt-2">
                Continue as guest user using secure CAPTCHA verification
              </p>

            </div>

            <div className="flex justify-center mb-2">

              <ReCAPTCHA
                sitekey="6Ld2xeUsAAAAAH36l3M2dXv4G2ZRFOTDywBCKQCZ"
                onChange={(value) => setCaptchaToken(value)}
              />

            </div>


            <button
                type="button"
                onClick={() => {
                alert("GUEST BUTTON WORKS")
                    handleGuestAccess()
                }}
                style={{
                    width: "100%",
                    padding: "18px",
                    backgroundColor: "#00d84f",
                    color: "black",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginTop: "20px",
                    position: "relative",
                    zIndex: 9999,
                    pointerEvents: "auto",
                }}
            >
                Continue as Guest
            </button>

            <div className="text-center text-sm text-gray-500 mt-3">
              Guest users have limited access to SentinelZero features
            </div>
          </div>

        </div>

      </div>

    )
  }

  return (

    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">

      {/* Sidebar */}

      <div className="w-full md:w-64 bg-zinc-950 border-b md:border-b-0 md:border-r border-cyan-500 p-6">

        <h1 className="text-3xl font-bold text-cyan-400">
          SentinelZero
        </h1>

        <div className="mt-10 space-y-4">

          <div
            onClick={() => setActivePage("dashboard")}
            className={`p-3 rounded-lg cursor-pointer ${
              activePage === "dashboard"
                ? "bg-cyan-500/20"
                : "hover:bg-zinc-800"
            }`}
          >
            📊 Dashboard
          </div>

          <div
            onClick={() => setActivePage("threats")}
            className={`p-3 rounded-lg cursor-pointer ${
              activePage === "threats"
                ? "bg-cyan-500/20"
                : "hover:bg-zinc-800"
            }`}
          >
            🚨 Threat Monitoring
          </div>

          {!isGuest && (
            <div
              onClick={() => setActivePage("iam")}
              className={`p-3 rounded-lg cursor-pointer ${
                activePage === "iam"
                  ? "bg-cyan-500/20"
                  : "hover:bg-zinc-800"
              }`}
            >
              🔐 IAM Security
            </div>
          )}

          <div
            onClick={() => setActivePage("cloud")}
            className={`p-3 rounded-lg cursor-pointer ${
              activePage === "cloud"
                ? "bg-cyan-500/20"
                : "hover:bg-zinc-800"
            }`}
          >
            ☁️ Cloud Infrastructure
          </div>

          {!isGuest && (
            <div
              onClick={() => setActivePage("incidents")}
              className={`p-3 rounded-lg cursor-pointer ${
                activePage === "incidents"
                  ? "bg-cyan-500/20"
                  : "hover:bg-zinc-800"
              }`}
            >
              📁 Incident Reports
            </div>
          )}

          {!isGuest && (
            <div
              onClick={() => setActivePage("settings")}
              className={`p-3 rounded-lg cursor-pointer ${
                activePage === "settings"
                  ? "bg-cyan-500/20"
                  : "hover:bg-zinc-800"
              }`}
            >
              ⚙️ Settings
            </div>
          )}

        </div>

      </div>

      {/* Main Content */}

      <div className="flex-1 p-8">

        {/* Top Navbar */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">

          <div>

            <h1 className="text-5xl font-bold text-cyan-400 capitalize">
              {activePage}
            </h1>

            <p className="text-gray-400 mt-2 text-lg">
              Zero Trust Cloud Security Platform
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="bg-zinc-900 border border-green-500 px-4 py-2 rounded-lg">
              🟢 System Active
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500/10 border border-red-500 rounded-xl p-3"
            >
              Logout
            </button>

          </div>

        </div>

        {isGuest && (

          <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 px-6 py-4 rounded-xl mb-6 text-center text-lg font-semibold">

            Guest Mode Active — Limited Access Enabled

          </div>

        )}

        {isRestrictedPage && (

          <div className="text-center text-gray-400 text-2xl mt-20">
            Restricted Access — Please login with a registered account
          </div>

        )}

        {/* Dashboard */}

        {
          activePage === "dashboard" && (

            <>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-xl font-semibold">
                    Blocked IPs
                  </h2>

                  <p className="text-4xl mt-4 text-red-400 font-bold">
                    {blockedIpsCount}
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-xl font-semibold">
                    Failed MFA Attempts
                  </h2>

                  <p className="text-4xl mt-4 text-yellow-400 font-bold">
                    {mfaAttempts}
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-xl font-semibold">
                    Threat Level
                  </h2>

                  <p className="text-4xl mt-4 text-green-400 font-bold">
                    {threatLevel}
                  </p>
                </div>

              </div>

              {/* Threat Activity Chart */}

              <div className="bg-zinc-900 mt-10 p-6 rounded-2xl border border-cyan-500">

                <h2 className="text-2xl font-bold mb-6">
                  Threat Activity
                </h2>

                <div className="h-80">

                  <ResponsiveContainer width="100%" height="100%">

                    <LineChart data={threatData}>

                      <XAxis
                        dataKey="time"
                        stroke="#ffffff"
                      />

                      <YAxis
                        stroke="#ffffff"
                      />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="threats"
                        stroke="#06b6d4"
                        strokeWidth={3}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              </div>

              {/* Global Threat Activity */}

              <div className="bg-zinc-900 mt-10 p-6 rounded-2xl border border-cyan-500">

                <h2 className="text-2xl font-bold mb-6">
                  🌍 Global Threat Activity
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {globalThreats.map((item, index) => (

                    <div
                      key={index}
                      className="bg-black border border-cyan-500 rounded-xl p-4"
                    >

                      <h3 className="text-red-400 font-bold">

                        {item.country}

                      </h3>

                      <p className="text-3xl font-bold text-white mt-2">

                        {item.attacks}

                      </p>

                      <p className="text-gray-400 text-sm mt-1">

                        {item.type}

                      </p>

                    </div>

                  ))}

                </div>

              </div>

              {/* Automated Responses */}

              <div className="bg-zinc-900 mt-10 p-6 rounded-2xl border border-cyan-500">

                <h2 className="text-2xl font-bold mb-6">
                  🤖 Automated Responses
                </h2>

                <div className="space-y-4">

                  {liveResponses.map((response, index) => (

                    <div
                      key={index}
                      className="bg-black border border-green-500 rounded-xl p-4"
                    >

                      <h3 className="text-green-400 font-bold">

                        {response.title}

                      </h3>

                      <p className="text-white mt-2">

                        ALERT: {response.description}

                      </p>

                      <p className="text-gray-500 text-sm mt-2">

                        {response.time}

                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </>

          )
        }

        {/* Threat Monitoring */}

        {
          activePage === "threats" && (

            <div className="bg-zinc-900 mt-10 p-6 rounded-2xl border border-cyan-500">

              <style>{`
                .threat-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: #06b6d4 #18181b;
                }

                .threat-scrollbar::-webkit-scrollbar {
                  width: 8px;
                }

                .threat-scrollbar::-webkit-scrollbar-track {
                  background: #18181b;
                  border-radius: 9999px;
                }

                .threat-scrollbar::-webkit-scrollbar-thumb {
                  background: linear-gradient(180deg, #22d3ee, #0e7490);
                  border-radius: 9999px;
                }
              `}</style>

              <h2 className="text-2xl font-bold mb-6">
                Live Threat Feed
              </h2>

              <p className="text-cyan-300 text-sm mb-4 animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">
                ⚡ Simulated attacks are generated every 60 seconds for live SOC monitoring
              </p>

              <div className="threat-scrollbar h-[620px] overflow-y-auto scroll-smooth pr-2 space-y-2">

                {
                  (threatsFeedData || []).map((threat, index) => {

                    const severityValue = String(threat?.severity || "LOW").toUpperCase()
                    const severityClass =
                      severityValue === "CRITICAL"
                        ? "border-red-500 bg-red-500/10"
                        : severityValue === "HIGH"
                        ? "border-orange-500 bg-orange-500/10"
                        : severityValue === "MEDIUM"
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-blue-500 bg-blue-500/10"

                    const severityTextClass =
                      severityValue === "CRITICAL"
                        ? "text-red-400"
                        : severityValue === "HIGH"
                        ? "text-orange-400"
                        : severityValue === "MEDIUM"
                        ? "text-yellow-400"
                        : "text-blue-400"

                    return (

                      <div
                        key={threat?.id || index}
                        className={`p-5 rounded-xl border ${severityClass}`}
                      >

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Threat Type</p>
                            <p className="font-bold text-white mt-1">
                              {threat?.type || threat?.message || threat?.attack || threat?.label || "Unknown Threat"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Severity</p>
                            <p className={`font-bold mt-1 ${severityTextClass}`}>{threat?.severity || "Low"}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">IP</p>
                            <p className="font-bold text-white mt-1">{threat?.ip || threat?.source_ip || "Unknown"}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Status</p>
                            <p className="font-bold text-white mt-1">{threat?.status || "Detected"}</p>
                          </div>
                        </div>

                        <p className="text-xs text-cyan-300 mt-3">
                          {threat?.detected || `Detected: ${threat?.time || threat?.timestamp || "just now"}`}
                        </p>

                      </div>

                    )

                  })
                }

              </div>

            </div>

          )
        }

        {/* IAM Security */}

        {
          activePage === "iam" && !isGuest && (

    <div className="space-y-8 mt-10">

      {/* Top IAM Metrics */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
          <h2 className="text-xl font-semibold">
            MFA Enabled Users
          </h2>

          <p className="text-4xl mt-4 text-green-400 font-bold">
            {mfaEnabledUsers}%
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
          <h2 className="text-xl font-semibold">
            Privilege Escalation Alerts
          </h2>

          <p className="text-4xl mt-4 text-red-400 font-bold">
            {privilegeAlerts}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
          <h2 className="text-xl font-semibold">
            Blocked Accounts
          </h2>

          <p className="text-4xl mt-4 text-yellow-400 font-bold">
            {blockedAccounts}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
          <h2 className="text-xl font-semibold">
            Access Denied Events
          </h2>

          <p className="text-4xl mt-4 text-cyan-400 font-bold">
            {accessDeniedEvents}
          </p>
        </div>

      </div>

      {/* IAM Analytics */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* MFA Compliance Chart */}

        <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">

          <h2 className="text-2xl font-bold mb-6">
            MFA Compliance
          </h2>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={mfaComplianceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >

                  {
                    mfaComplianceData.map((entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />

                    ))
                  }

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* IAM Audit Logs */}

        <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">

          <h2 className="text-2xl font-bold mb-6">
            IAM Audit Logs
          </h2>

          <div className="space-y-4">

            {iamLogs.map((log, index) => (

              <div
                key={index}
                className="bg-black border border-gray-700 rounded-lg p-4"
              >

                <p className="text-white text-sm">

                  {log}

                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Suspicious Users Table */}

      <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">

        <h2 className="text-2xl font-bold mb-6">
          Suspicious IAM Users
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-zinc-700 text-left">

                <th className="pb-4">User</th>
                <th className="pb-4">Risk</th>
                <th className="pb-4">Activity</th>
                <th className="pb-4">Timestamp</th>

              </tr>

            </thead>

            <tbody>

              {suspiciousUsers.map((user, index) => (

                <tr
                  key={index}
                  className="border-t border-gray-800"
                >

                  <td className="py-4 text-gray-300">

                    {user.user}

                  </td>

                  <td className="py-4">

                    <span
                      className={`
                        px-3 py-1 rounded-lg text-xs font-bold
                        ${
                          user.risk === "HIGH"
                            ? "bg-red-900 text-red-300"
                            : user.risk === "MEDIUM"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-green-900 text-green-300"
                        }
                      `}
                    >

                      {user.risk}

                    </span>

                  </td>

                  <td className="py-4 text-gray-300">

                    {user.activity}

                  </td>

                  <td className="py-4 text-gray-500">

                    {user.timestamp}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )
}

        {/* Cloud Infrastructure */}

        {
          activePage === "cloud" && (

            <div className="space-y-6 mt-10">

              <h1 className="text-5xl font-bold text-cyan-400">
                Cloud Infrastructure
              </h1>

              <p className="text-gray-400">
                Zero Trust Cloud Security Platform
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-lg font-semibold">
                    Active EC2 Instances
                  </h2>

                  <p className="text-4xl mt-4 text-cyan-400 font-bold">
                    {ec2Instances}
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-lg font-semibold">
                    VPC Networks
                  </h2>

                  <p className="text-4xl mt-4 text-green-400 font-bold">
                    {vpcNetworks}
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-lg font-semibold">
                    Security Groups
                  </h2>

                  <p className="text-4xl mt-4 text-yellow-400 font-bold">
                    {securityGroups}
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-lg font-semibold">
                    Cloud Threat Alerts
                  </h2>

                  <p className="text-4xl mt-4 text-red-400 font-bold">
                    {cloudThreatAlerts}
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">

                  <h2 className="text-3xl font-bold mb-6">
                    Infrastructure Usage
                  </h2>

                  <div className="h-[300px]">

                    <ResponsiveContainer width="100%" height="100%">

                      <LineChart data={infrastructureUsageData}>

                        <XAxis dataKey="time" stroke="#888" />

                        <YAxis stroke="#888" />

                        <Tooltip />

                        <Line
                          type="monotone"
                          dataKey="cpu"
                          stroke="#22d3ee"
                          strokeWidth={3}
                        />

                        <Line
                          type="monotone"
                          dataKey="memory"
                          stroke="#00ff88"
                          strokeWidth={3}
                        />

                      </LineChart>

                    </ResponsiveContainer>

                  </div>

                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">

                  <h2 className="text-3xl font-bold mb-6">
                    Infrastructure Health
                  </h2>

                  <div className="space-y-4">

                    {infrastructureHealth.map((item, index) => (

                      <div
                        key={index}
                        className="bg-black p-4 rounded-xl border border-gray-800 flex justify-between items-center"
                      >

                        <span className="font-semibold">
                          {item.service}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold

        ${item.status === "Healthy"
          ? "bg-green-900 text-green-300"

          : "bg-yellow-900 text-yellow-300"
        }`}
                        >

                          {item.status}

                        </span>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">

                  <h2 className="text-3xl font-bold mb-6">
                    Open Ports Monitoring
                  </h2>

                  <table className="w-full">

                    <thead>

                      <tr className="border-b border-zinc-700 text-left text-gray-400">

                        <th className="pb-4">Port</th>
                        <th className="pb-4">Service</th>
                        <th className="pb-4">Risk</th>

                      </tr>

                    </thead>

                    <tbody>

                      {openPorts.map((port, index) => (

                        <tr
                          key={index}
                          className="border-b border-gray-800"
                        >

                          <td className="py-4">
                            {port.port}
                          </td>

                          <td>
                            {port.service}
                          </td>

                          <td>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold

          ${port.risk === "HIGH"
            ? "bg-red-900 text-red-300"

            : port.risk === "MEDIUM"
            ? "bg-yellow-900 text-yellow-300"

            : "bg-green-900 text-green-300"
          }`}
                            >

                              {port.risk}

                            </span>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">

                  <h2 className="text-3xl font-bold mb-6">
                    Cloud Audit Logs
                  </h2>

                  <div className="space-y-4">

                    {
                      cloudAuditLogs.map((log, index) => (

                        <div
                          key={index}
                          className="bg-black border border-zinc-700 rounded-xl p-4 text-white"
                        >

                          {log}

                        </div>

                      ))
                    }

                  </div>

                </div>

              </div>

              <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">

                <h2 className="text-3xl font-bold mb-6">
                  Region Traffic Analysis
                </h2>

                <div className="h-[350px]">

                  <ResponsiveContainer width="100%" height="100%">

                    <BarChart data={regionTrafficData}>

                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />

                      <XAxis dataKey="region" />

                      <YAxis stroke="#888" />

                      <Tooltip />

                      <Bar
                        dataKey="traffic"
                        fill="#00ff88"
                        radius={[8, 8, 0, 0]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

          )
        }

        {/* Incident Reports */}

        {
          activePage === "incidents" && !isGuest && (

            <div className="space-y-6 mt-10">

              <h1 className="text-5xl font-bold text-cyan-400">
                Incident Reports
              </h1>

              <p className="text-gray-400">
                SOC Incident Management & Threat Investigation
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {
                  (attackCategories || []).map((category, index) => (

                    <div
                      key={index}
                      className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6"
                    >

                      <h2 className="text-lg font-semibold text-white">
                        {category.title}
                      </h2>

                      <p className={`text-5xl mt-4 font-bold ${category.color}`}>
                        {category.count}
                      </p>

                    </div>

                  ))
                }

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-3xl font-bold mb-6">
                    Incident Status Distribution
                  </h2>

                  <div className="h-[320px]">

                    <ResponsiveContainer width="100%" height="100%">

                      <PieChart>

                        <Pie
                          data={incidentDistributionData || []}
                          dataKey="value"
                          outerRadius={120}
                        >

                          {
                            (incidentDistributionData || []).map((entry, index) => (

                              <Cell
                                key={index}
                                fill={
                                  index === 0
                                    ? "#00ff88"
                                    : index === 1
                                    ? "#facc15"
                                    : "#ff4d4f"
                                }
                              />

                            ))
                          }

                        </Pie>

                        <Tooltip />

                      </PieChart>

                    </ResponsiveContainer>

                  </div>

                </div>

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-3xl font-bold mb-6">
                    MITRE ATT&CK Mapping
                  </h2>

                  <div className="space-y-4">

                    {(mitreMappings || []).map((item, index) => (

                      <div
                        key={index}
                        className="bg-black p-4 rounded-xl border border-gray-800"
                      >

                        {item}

                      </div>

                    ))}

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-3xl font-bold mb-6">
                    SOC Analyst Queue
                  </h2>

                  <table className="w-full">

                    <thead>

                      <tr className="border-b border-zinc-700 text-left text-gray-400">

                        <th className="pb-4">Analyst</th>
                        <th className="pb-4">Incidents</th>
                        <th className="pb-4">Status</th>

                      </tr>

                    </thead>

                    <tbody>

                      {(socAnalysts || []).map((analyst, index) => (

                        <tr
                          key={index}
                          className="border-b border-gray-800"
                        >

                          <td className="py-4">

                            {analyst.analyst}

                          </td>

                          <td>

                            {analyst.incidents}

                          </td>

                          <td>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold

          ${analyst.status === "Online"

            ? "bg-green-900 text-green-300"

            : "bg-yellow-900 text-yellow-300"

          }`}
                            >

                              {analyst.status}

                            </span>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-3xl font-bold mb-6">
                    Reports Overview
                  </h2>

                  <div className="space-y-4 mb-8">

                    {(reports || []).map((report, index) => (

                      <div
                        key={report?.id || index}
                        className="bg-black border border-zinc-700 rounded-xl p-4"
                      >

                        <p className="text-white font-semibold">
                          {report?.title || "Untitled Incident"}
                        </p>

                        <p className="text-gray-400 mt-2 text-sm">
                          Severity: {report?.severity || "Unknown"} • Status: {report?.status || "Unknown"}
                        </p>

                      </div>

                    ))}

                  </div>

                  <h2 className="text-3xl font-bold mb-6">
                    Incident Timeline
                  </h2>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto">

                    {
                      (threatsFeedData || []).map((threat, index) => {

                        const severity =
                          threat.severity ||
                          (threat.label && threat.label !== "BENIGN"
                            ? "HIGH"
                            : "LOW")

                        const message =
                          threat.message ||
                          threat.attack ||
                          threat.label ||
                          "Unknown Threat"

                        const timestamp =
                          threat.time ||
                          threat.timestamp ||
                          "Live"

                        return (

                          <tr
                            key={index}
                            className="border-b border-zinc-800"
                          >

                            <td className="py-4">

                              <span
                                className={`px-3 py-1 rounded-lg font-bold ${
                                  severity === "HIGH"
                                    ? "bg-red-500/20 text-red-400"
                                    : severity === "MEDIUM"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}
                              >

                                {severity}

                              </span>

                            </td>

                            <td className="py-4">
                              {message}
                            </td>

                            <td className="py-4 text-gray-400">
                              {timestamp}
                            </td>

                          </tr>

                        )

                      })
                    }

                  </div>

                </div>

              </div>

            </div>

          )
        }

        {/* Settings */}

        {
          activePage === "settings" && !isGuest && (

            <div className="space-y-6 mt-10">

              <h1 className="text-5xl font-bold text-cyan-400">
                Settings
              </h1>

              <p className="text-gray-400">
                SOC Platform Administration & Configuration
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-lg font-semibold">
                    Detection Rules
                  </h2>

                  <p className="text-5xl font-bold text-cyan-400 mt-4">
                    {detectionRules}
                  </p>

                </div>

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-lg font-semibold">
                    Threat Feeds
                  </h2>

                  <p className="text-5xl font-bold text-green-400 mt-4">
                    {threatFeeds}
                  </p>

                </div>

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-lg font-semibold">
                    API Integrations
                  </h2>

                  <p className="text-5xl font-bold text-yellow-400 mt-4">
                    {apiIntegrations}
                  </p>

                </div>

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-lg font-semibold">
                    Active Sessions
                  </h2>

                  <p className="text-5xl font-bold text-red-400 mt-4">
                    {activeSessions}
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-3xl font-bold mb-6">
                    SIEM Integrations
                  </h2>

                  <div className="space-y-4">

                    {siemIntegrations.map((integration, index) => (

                      <div
                        key={index}
                        className="bg-black p-4 rounded-xl border border-gray-800 flex justify-between items-center"
                      >

                        <span className="font-semibold">
                          {integration.name}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold

        ${integration.status === "Connected" ||
          integration.status === "Active"

          ? "bg-green-900 text-green-300"

          : integration.status === "Warning"

          ? "bg-yellow-900 text-yellow-300"

          : "bg-red-900 text-red-300"
        }`}
                        >

                          {integration.status}

                        </span>

                      </div>

                    ))}

                  </div>

                </div>

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-3xl font-bold mb-6">
                    System Health
                  </h2>

                  <div className="space-y-4">

                    {systemHealthData.map((item, index) => (

                      <div
                        key={index}
                        className="bg-black p-4 rounded-xl border border-gray-800 flex justify-between items-center"
                      >

                        <span className="font-semibold">
                          {item.service}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold

        ${item.status === "Operational"

          ? "bg-green-900 text-green-300"

          : "bg-yellow-900 text-yellow-300"
        }`}
                        >

                          {item.status}

                        </span>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-3xl font-bold mb-6">
                    Active User Sessions
                  </h2>

                  <table className="w-full">

                    <thead>

                      <tr className="border-b border-zinc-700 text-left text-gray-400">

                        <th className="pb-4">User</th>
                        <th className="pb-4">IP Address</th>
                        <th className="pb-4">Location</th>

                      </tr>

                    </thead>

                    <tbody>

                      {activeUserSessions.map((session, index) => (

                        <tr
                          key={index}
                          className="border-b border-gray-800"
                        >

                          <td className="py-4">

                            {session.user}

                          </td>

                          <td>

                            {session.ip}

                          </td>

                          <td>

                            {session.location}

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

                <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-6">

                  <h2 className="text-3xl font-bold mb-6">
                    Security Configuration
                  </h2>

                  <div className="space-y-6">

                    {securityConfigurations.map((config, index) => (

                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >

                        <span>

                          {config.name}

                        </span>

                        <div
                          className={`w-12 h-6 rounded-full transition-all duration-300

        ${config.enabled

          ? "bg-green-500"

          : "bg-red-500"
        }`}
                        />

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            </div>

          )
        }

      </div>

    </div>
  )
}

export default App