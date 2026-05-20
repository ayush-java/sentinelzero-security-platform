# 🛡️ SentinelZero

# 🚀 Next-Generation Cloud Cybersecurity Platform

🌐 LIVE DEPLOYMENT: https://sentinelzero.org

SentinelZero is a fully deployed enterprise-style cybersecurity platform built using:

- React
- Flask
- Gunicorn
- Nginx
- AWS EC2
- Cloudflare
- Linux
- Google reCAPTCHA
- HTTPS SSL Encryption

The platform demonstrates real-world:

- cloud engineering
- cybersecurity deployment
- Linux server administration
- production infrastructure
- secure frontend/backend communication
- DevOps deployment workflows
- reverse proxy configuration
- real-world debugging experience

---

# 🎥 Live Demo Video

Watch the full deployment walkthrough and project demonstration here:

👉 ADD_YOUR_LOOM_VIDEO_LINK_HERE

The demo includes:

- AWS EC2 deployment
- HTTPS custom domain setup
- Cloudflare DNS configuration
- React frontend hosting
- Flask backend APIs
- Nginx reverse proxy configuration
- Gunicorn production deployment
- Google reCAPTCHA integration
- secure authentication flow
- real-world debugging process
- GitHub deployment workflow

---

# 🌐 Live Production Deployment

## 🔥 Live Website

👉 https://sentinelzero.org

---

# ✅ Production Infrastructure

- ✅ Custom Domain Deployment
- ✅ HTTPS SSL Encryption
- ✅ Cloudflare CDN + DNS
- ✅ AWS EC2 Ubuntu Hosting
- ✅ React + Flask Architecture
- ✅ Gunicorn Production Backend
- ✅ Nginx Reverse Proxy
- ✅ systemd Backend Service
- ✅ Persistent Backend Hosting
- ✅ Google reCAPTCHA Integration
- ✅ Secure API Communication
- ✅ Production Deployment Workflow
- ✅ Public Cloud Deployment
- ✅ GitHub Deployment Pipeline

---

# 🏗️ Architecture Diagram

![SentinelZero Architecture](docs/sentinelzero-architecture.png)

```text
Users
   ↓
Cloudflare CDN + SSL
   ↓
HTTPS Secure Routing
   ↓
AWS EC2 Ubuntu Server
   ↓
Nginx Reverse Proxy
   ↓
React + Vite Frontend
   ↓
REST API Communication
   ↓
Gunicorn Production Server
   ↓
Flask Backend APIs
   ↓
Authentication + Security Layer
   ↓
Threat Analytics / Logging
```

---

# ⚙️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | React |
| Frontend Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend | Flask |
| Production Backend | Gunicorn |
| Reverse Proxy | Nginx |
| Cloud Hosting | AWS EC2 |
| DNS + SSL | Cloudflare |
| Operating System | Ubuntu Linux |
| CAPTCHA Security | Google reCAPTCHA |
| Deployment Workflow | Git + GitHub |
| API Communication | REST APIs |
| Authentication | Flask Auth System |
| Backend Language | Python |
| Frontend Language | JavaScript |
| Process Management | systemd |

---

# ☁️ Cloud Deployment

SentinelZero is fully deployed on AWS cloud infrastructure using a production-grade architecture.

## Deployment Stack

- AWS EC2 Ubuntu Server
- Nginx Reverse Proxy
- Gunicorn WSGI Server
- Flask Backend APIs
- React + Vite Frontend
- Cloudflare CDN + DNS
- HTTPS SSL Encryption
- Linux systemd Service Automation

---

# 🔐 Authentication System

SentinelZero includes:

- secure login system
- account creation
- guest access mode
- CAPTCHA-protected authentication
- secure frontend/backend communication

---

# 🛡️ Google reCAPTCHA Protection

SentinelZero integrates Google reCAPTCHA to secure guest authentication and prevent automated abuse.

Features include:

- “I’m not a robot” verification
- image-based CAPTCHA challenges
- bot prevention
- secure guest access validation

This improves:

- authentication security
- abuse prevention
- production realism
- enterprise-grade protection

---

# 🏗️ Production Infrastructure

## ⚡ Gunicorn Production WSGI Server

The backend uses Gunicorn instead of Flask’s development server.

Benefits include:

- production-grade hosting
- multiple request handling
- persistent backend services
- stable Linux deployment

---

## ⚡ systemd Linux Backend Service

The backend runs as a permanent Linux service using:

```bash
sudo systemctl start sentinelzero
sudo systemctl enable sentinelzero
```

This enables:

- automatic backend startup
- persistent hosting
- crash recovery
- production deployment behavior

---

## ⚡ Nginx Reverse Proxy

Nginx is configured as a production reverse proxy for:

- frontend hosting
- backend API routing
- HTTPS traffic handling
- secure request forwarding

---

# 🧠 Real-World Debugging Experience

During deployment, multiple real production issues were debugged and resolved, including:

- frontend/backend communication failures
- localhost deployment issues
- EC2 security group networking
- Cloudflare SSL configuration
- Nginx reverse proxy debugging
- Gunicorn backend deployment
- API routing failures
- HTTPS mixed-content issues
- reCAPTCHA domain validation
- Node.js version incompatibility
- GitHub deployment synchronization
- Linux service management
- browser caching issues
- cloud networking failures
- production deployment troubleshooting

---

# 📊 Security Features

## ☁️ Cloud Security

AWS deployment security includes:

- EC2 Security Groups
- Cloudflare protection
- HTTPS SSL encryption
- secure backend isolation
- protected public routing

---

## 🔐 Secure Backend Infrastructure

Backend security includes:

- Gunicorn production hosting
- Linux process isolation
- secure API communication
- systemd-managed services
- production-grade deployment

---

# 📁 Project Structure

```text
sentinelzero-security-platform/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── users.json
│   ├── auth_logs.json
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── assets/
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── dist/
│
├── docs/
│   └── sentinelzero-architecture.png
│
├── README.md
└── .gitignore
```

---

# 🧪 How To Run Locally

## 1. Clone Repository

```bash
git clone https://github.com/ayush-java/sentinelzero-security-platform.git

cd sentinelzero-security-platform
```

---

## 2. Setup Backend

```bash
cd backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

---

## 3. Start Backend

```bash
python3 app.py
```

Backend runs on:

```bash
http://localhost:5001
```

---

## 4. Setup Frontend

Open another terminal:

```bash
cd frontend

npm install
```

---

## 5. Start Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🚀 Production Deployment Workflow

## Frontend Deployment

```bash
npm run build

sudo rm -rf /var/www/html/*

sudo cp -r dist/* /var/www/html/

sudo systemctl restart nginx
```

---

## Backend Deployment

```bash
sudo systemctl restart sentinelzero
```

---

## Backend Service Status

```bash
sudo systemctl status sentinelzero
```

---

## Live Backend Logs

```bash
journalctl -u sentinelzero -f
```

---

# 🎯 Learning Outcomes

This project demonstrates:

- cloud engineering
- AWS deployment
- Cloudflare configuration
- Linux server management
- Nginx reverse proxy configuration
- Gunicorn backend deployment
- frontend/backend production architecture
- React deployment
- Flask API development
- GitHub deployment workflows
- HTTPS SSL deployment
- cybersecurity deployment practices
- CAPTCHA security integration
- DevOps workflows
- persistent backend infrastructure
- production debugging

---

# 🚀 Enterprise-Level Features

- Zero Trust Authentication
- Google reCAPTCHA Verification
- HTTPS SSL Encryption
- Cloudflare Protection
- Secure Guest Access
- Persistent Linux Backend Services
- Reverse Proxy Infrastructure
- Cloud-Native Deployment
- Real-Time Backend APIs
- Production-Grade Architecture

---

# 📌 Future Improvements

Planned future upgrades:

- JWT authentication
- PostgreSQL database integration
- Docker containerization
- CloudWatch logging
- AWS WAF integration
- CI/CD GitHub Actions
- threat intelligence APIs
- SIEM analytics dashboard
- attack monitoring
- role-based access control
- Redis caching
- live threat simulation engine

---

# 👤 Author

## Ayush Velhal

- Full-stack architecture & development
- AWS cloud deployment
- Linux production deployment
- Frontend/backend engineering
- Cloudflare & HTTPS configuration
- Nginx reverse proxy implementation
- Gunicorn production backend setup
- CAPTCHA security integration
- Production debugging & infrastructure setup

---

# ⭐ Final Note

SentinelZero demonstrates a real-world cloud cybersecurity deployment pipeline by combining:

- cloud infrastructure
- secure authentication systems
- HTTPS SSL encryption
- Cloudflare protection
- Linux production hosting
- frontend/backend deployment
- Nginx reverse proxy routing
- production web servers
- persistent backend services
- CAPTCHA security
- DevOps deployment workflows
- cloud networking
- real-world debugging

into a fully deployed next-generation cybersecurity platform hosted on AWS cloud infrastructure.