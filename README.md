# BloodLink: Mumbai Emergency Blood Coordination Network Prototype

BloodLink is an interactive, role-based emergency blood coordination web platform designed for the healthcare ecosystem of the **Mumbai Metropolitan Region (MMR)** (Mumbai City, Mumbai Suburban, Thane, and Navi Mumbai).

> **Statutory Disclaimer:**
> BloodLink is a **software availability coordination network**, NOT a blood seller, blood bank, medical service provider, blood delivery operator, or donor broker. In compliance with the *Drugs and Cosmetics Act (Form 28C)* and *National Blood Transfusion Council (NBTC)* guidelines:
> - Blood cannot be purchased, sold, or commercially transacted.
> - ABO/Rh matching alone never replaces mandatory laboratory crossmatching.
> - All blood dispensation requires an authorized physician requisition and physical pilot test tube.

---

## 🌟 Key Architecture & Product Features

### 1. Multi-Role Operating Environments
- **Role 1 — Patient / Family Caregiver**: Transparent emergency search, verified Form 28C blood centre directory, contact details, live status tracking, and essential safety advisories.
- **Role 2 — Hospital Transfusion Dashboard**: Real-time requisition desk, duplicate warning guard, parallel broadcast to verified partner blood centres, multi-bank response matrix, and audit logging.
- **Role 3 — Verified Blood Bank Dashboard**: Component inventory grid (PRBC, Platelets/RDP, SDP, FFP, Cryoprecipitate), **automatic STALE inventory flagging** after configurable freshness window (default: 6h), physical stock audit updates, and independent response queue.
- **Role 4 — Voluntary Donor Registry**: 100% voluntary, non-commercial opt-in registry, preference controls, privacy masking, and permanent account deletion workflow.
- **Role 5 — Platform Administrator**: Regulatory console, institutional document verification queue (Form 28C review), partner approval/suspension, immutable audit trails, and stale threshold configuration.

### 2. Built for Reviewers: 1-Click Interactive Demo Mode
Reviewers can jump into any operational dashboard instantly via the **top demo pill banner** or the login demo selector. No registration or sensitive patient data required.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (Node v24 tested)
- **Python**: 3.10+ (Python 3.11 tested)

---

### Step 1: Run the Backend REST API (Flask + SQLite)
```bash
cd backend
# Create and activate virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend test suite (Verifies auth, roles, routing, duplicates, stale logic)
python test_backend.py

# Launch API server (port 5000)
python app.py
```
Backend API will boot at `http://127.0.0.1:5000` and automatically seed initial Mumbai medical demo data.

---

### Step 2: Run the Frontend (React + Vite + Tailwind CSS)
In a separate terminal:
```bash
cd frontend
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Hospital** | `hospital@bloodlink.org` | `demo123` | KEM Hospital Transfusion Team |
| **Blood Bank** | `bank@bloodlink.org` | `demo123` | Tata Memorial Blood Centre |
| **Caregiver** | `public@bloodlink.org` | `demo123` | Family Caregiver Emergency Search |
| **Donor** | `donor@bloodlink.org` | `demo123` | Voluntary Community Donor |
| **Admin** | `admin@bloodlink.org` | `demo123` | Platform Compliance Officer |

*(Note: In the UI, clicking any role on the Demo Banner switches active accounts instantaneously without re-typing passwords).*

---

## 🧪 Comprehensive Test Coverage
Run the backend automated test suite:
```bash
cd backend
python test_backend.py
```
**Tests Include:**
1. Authentication & JWT issuing
2. Role permissions guard (403 forbidden on unauthorized actions)
3. Request creation & parallel routing to verified blood banks
4. Duplicate request detection (prevents double submissions within 15 min window)
5. Blood bank independent response lifecycle
6. Stale inventory calculation (>6 hours threshold)
7. Hospital data isolation boundary

---

## 📋 Acceptance Walkthrough (Try This Out!)
1. Open `http://localhost:5173`.
2. Notice the **Statutory Healthcare Notice** and verified Mumbai healthcare directory.
3. Click **Hospital** on the top Demo Banner (logs in as Dr. Ananya Sen, KEM Hospital).
4. Click **"Raise Emergency Requirement"**. Select **O-** and **Packed Red Blood Cells (PRBC)**, 2 units, Critical urgency. Click **Dispatch Emergency Query**.
5. Switch to **Blood Bank** role on the top Demo Banner (switches to Kavita Deshmukh, Tata Memorial Blood Centre).
6. Open the **Incoming Emergency Queue** tab. You will see the new requisition. Click **Respond / View Case**.
7. Click **Update Blood Bank Response**, select **Availability Confirmed**, report 2 units on shelf, and submit.
8. Switch back to **Hospital** role. Inspect the updated response status badge and event timeline.
9. Click **Select This Bank** to designate Tata Memorial for pilot tube transport.
10. Switch to **Admin** role to view the verification queue and security audit logs.
