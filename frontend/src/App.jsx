import { useEffect, useState } from "react"
import axios from "axios"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function App() {

  const [backendData, setBackendData] = useState(null)

  const [liveThreats, setLiveThreats] = useState([])

  const [responses, setResponses] = useState([])

  const [activePage, setActivePage] = useState("dashboard")

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const threatData = [
    { time: "10AM", threats: 2 },
    { time: "11AM", threats: 5 },
    { time: "12PM", threats: 3 },
    { time: "1PM", threats: 8 },
    { time: "2PM", threats: 6 },
    { time: "3PM", threats: 10 },
  ]

  useEffect(() => {

    const fetchData = () => {

      axios.get("http://127.0.0.1:5000/")
        .then((response) => {
          setBackendData(response.data)
        })
        .catch((error) => {
          console.log(error)
        })

      axios.get("http://127.0.0.1:5000/threats")
        .then((response) => {
          setLiveThreats(response.data)
        })
        .catch((error) => {
          console.log(error)
        })

      axios.get("http://127.0.0.1:5000/responses")
        .then((response) => {
          setResponses(response.data)
        })
        .catch((error) => {
          console.log(error)
        })

    }

    fetchData()

    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval)

  }, [])

  if (!isLoggedIn) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center p-6">

        <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-10 w-full max-w-md">

          <h1 className="text-4xl font-bold text-cyan-400 text-center">
            SentinelZero
          </h1>

          <p className="text-gray-400 text-center mt-3">
            Zero Trust Cloud Security Platform
          </p>

          <div className="mt-10 space-y-5">

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-4 text-white outline-none focus:border-cyan-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-4 text-white outline-none focus:border-cyan-500"
            />

            <button
              onClick={() => {

                if (
                  username === "admin" &&
                  password === "sentinel123"
                ) {

                  setIsLoggedIn(true)
                  setLoginError("")

                } else {

                  setLoginError("Invalid credentials")

                }

              }}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-lg transition"
            >
              Login
            </button>

            {
              loginError && (

                <p className="text-red-400 text-center">
                  {loginError}
                </p>

              )
            }

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
              onClick={() => setIsLoggedIn(false)}
              className="bg-red-500 hover:bg-red-400 px-5 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>

          </div>

        </div>

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
                    12
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-xl font-semibold">
                    Failed MFA Attempts
                  </h2>

                  <p className="text-4xl mt-4 text-yellow-400 font-bold">
                    28
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-xl font-semibold">
                    Threat Level
                  </h2>

                  <p className="text-4xl mt-4 text-green-400 font-bold">
                    Medium
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  <div className="bg-black border border-red-500 rounded-xl p-6">

                    <h3 className="text-xl font-bold text-red-400">
                      United States
                    </h3>

                    <p className="mt-4 text-3xl font-bold">
                      42
                    </p>

                    <p className="text-gray-400 mt-2">
                      Suspicious login attempts
                    </p>

                  </div>

                  <div className="bg-black border border-yellow-500 rounded-xl p-6">

                    <h3 className="text-xl font-bold text-yellow-400">
                      Germany
                    </h3>

                    <p className="mt-4 text-3xl font-bold">
                      18
                    </p>

                    <p className="text-gray-400 mt-2">
                      MFA bypass attempts
                    </p>

                  </div>

                  <div className="bg-black border border-green-500 rounded-xl p-6">

                    <h3 className="text-xl font-bold text-green-400">
                      Singapore
                    </h3>

                    <p className="mt-4 text-3xl font-bold">
                      9
                    </p>

                    <p className="text-gray-400 mt-2">
                      IAM policy violations
                    </p>

                  </div>

                </div>

              </div>

              {/* Automated Responses */}

              <div className="bg-zinc-900 mt-10 p-6 rounded-2xl border border-cyan-500">

                <h2 className="text-2xl font-bold mb-6">
                  🤖 Automated Responses
                </h2>

                <div className="space-y-4">

                  {
                    responses.length > 0 ? (

                      responses.map((response, index) => (

                        <div
                          key={index}
                          className="bg-black border border-green-500 rounded-xl p-5"
                        >

                          <p className="text-green-400 font-bold">
                            {response.action}
                          </p>

                          <p className="text-gray-300 mt-2">
                            {response.threat}
                          </p>

                          <p className="text-gray-500 text-sm mt-2">
                            {response.timestamp}
                          </p>

                        </div>

                      ))

                    ) : (

                      <p className="text-gray-400">
                        No automated responses yet
                      </p>

                    )
                  }

                </div>

              </div>

            </>

          )
        }

        {/* Threat Monitoring */}

        {
          activePage === "threats" && (

            <div className="bg-zinc-900 mt-10 p-6 rounded-2xl border border-cyan-500">

              <h2 className="text-2xl font-bold mb-6">
                Live Threat Feed
              </h2>

              <div className="space-y-4">

                {
                  liveThreats.length > 0 ? (

                    liveThreats.map((threat, index) => (

                      <div
                        key={index}
                        className={`p-5 rounded-xl border ${
                          threat.severity === "HIGH"
                            ? "border-red-500 bg-red-500/10"
                            : threat.severity === "MEDIUM"
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-green-500 bg-green-500/10"
                        }`}
                      >

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="font-bold text-lg">
                              {threat.severity} Threat
                            </p>

                            <p className="text-gray-300 mt-2">
                              {threat.message}
                            </p>

                          </div>

                          <p className="text-gray-400 text-sm ml-5">
                            {threat.time}
                          </p>

                        </div>

                      </div>

                    ))

                  ) : (

                    <p className="text-gray-400">
                      No live threats detected
                    </p>

                  )
                }

              </div>

            </div>

          )
        }

        {/* IAM Security */}

        {
          activePage === "iam" && (

            <div className="space-y-6 mt-10">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-xl font-semibold">
                    MFA Enabled Users
                  </h2>

                  <p className="text-4xl mt-4 text-green-400 font-bold">
                    94%
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-xl font-semibold">
                    Privilege Escalation Alerts
                  </h2>

                  <p className="text-4xl mt-4 text-red-400 font-bold">
                    3
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-xl font-semibold">
                    Blocked Accounts
                  </h2>

                  <p className="text-4xl mt-4 text-yellow-400 font-bold">
                    12
                  </p>
                </div>

              </div>

            </div>

          )
        }

        {/* Cloud Infrastructure */}

        {
          activePage === "cloud" && (

            <div className="space-y-6 mt-10">

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-lg font-semibold">
                    Active EC2 Instances
                  </h2>

                  <p className="text-4xl mt-4 text-cyan-400 font-bold">
                    8
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-lg font-semibold">
                    VPC Networks
                  </h2>

                  <p className="text-4xl mt-4 text-green-400 font-bold">
                    3
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-lg font-semibold">
                    Security Groups
                  </h2>

                  <p className="text-4xl mt-4 text-yellow-400 font-bold">
                    14
                  </p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500">
                  <h2 className="text-lg font-semibold">
                    Cloud Threat Alerts
                  </h2>

                  <p className="text-4xl mt-4 text-red-400 font-bold">
                    6
                  </p>
                </div>

              </div>

            </div>

          )
        }

        {/* Incident Reports */}

        {
          activePage === "incidents" && (

            <div className="bg-zinc-900 mt-10 p-6 rounded-2xl border border-cyan-500">

              <h2 className="text-3xl font-bold mb-6">
                📁 Live Incident Reports
              </h2>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-zinc-700 text-left">

                      <th className="pb-4">Severity</th>
                      <th className="pb-4">Threat</th>
                      <th className="pb-4">Timestamp</th>

                    </tr>

                  </thead>

                  <tbody className="text-gray-300">

                    {
                      liveThreats.length > 0 ? (

                        liveThreats.map((threat, index) => (

                          <tr
                            key={index}
                            className="border-b border-zinc-800"
                          >

                            <td className="py-4">

                              <span
                                className={`px-3 py-1 rounded-lg font-bold ${
                                  threat.severity === "HIGH"
                                    ? "bg-red-500/20 text-red-400"
                                    : threat.severity === "MEDIUM"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}
                              >

                                {threat.severity}

                              </span>

                            </td>

                            <td className="py-4">
                              {threat.message}
                            </td>

                            <td className="py-4 text-gray-400">
                              {threat.time}
                            </td>

                          </tr>

                        ))

                      ) : (

                        <tr>

                          <td className="py-4">
                            No incidents found
                          </td>

                        </tr>

                      )
                    }

                  </tbody>

                </table>

              </div>

            </div>

          )
        }

        {/* Settings */}

        {
          activePage === "settings" && (

            <div className="bg-zinc-900 mt-10 p-6 rounded-2xl border border-cyan-500">

              <h2 className="text-3xl font-bold mb-6">
                ⚙️ Settings
              </h2>

              <p className="text-gray-300">
                Configure platform preferences, notification settings, and integrations.
              </p>

            </div>

          )
        }

      </div>

    </div>
  )
}

export default App