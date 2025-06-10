# 💰 Online Personal Finance Dashboard

A modern full-stack personal finance management tool built with **Next.js 15 (App Router)**, **Ant Design UI**, and **Flask API backend**. It helps users manage income, expenses, investments, budgets, and financial goals — all in one elegant dashboard.

---

## 🚀 Project Overview

Managing personal finances can be complicated. This web app aims to simplify financial planning by offering:

- Budget tracking
- Expense categorization
- Investment monitoring
- Goal progress tracking
- Visual reports and alerts

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** (App Router)
- **React 18**
- **Ant Design v5+**
- **TypeScript**
- **Zustand/Redux Toolkit** (if used)
- **Chart.js / Recharts** for graphs

### Backend

- **Python 3**
- **Flask**
- **Flask-CORS**
- **JWT for authentication**
- **SQLAlchemy**

### Database

- **MySQL 8+** / **MariaDB**

---

## ✨ Features

### 💸 Expense Categorization
- Auto-categorize & customize categories

### 📊 Budget Tracking
- Set budgets, visualize progress, get alerts

### 🎯 Goal Progress
- Track savings or debt goals with progress bars

### 📈 Investments
- Monitor portfolio performance and analytics

### 💰 Debt Management
- Track and plan loan repayments

### 📉 Reports
- Exportable summaries & tax estimations

### 🔔 Notifications
- Real-time reminders for key financial events

### 🔐 Security
- Auth + encrypted sensitive data

---

## 📦 Project Structure

/frontend (Next.js + Ant Design)
/backend (Flask API)
/docs (diagrams, ERD, reports)
/sql (DB schema)


---

## 📐 Non-Functional Goals

- ⚡ Fast & responsive UI
- 🔒 Secure user sessions
- 🌍 Cross-device support (mobile/tablet/desktop)
- 📶 Sync across devices via API
- ☁️ Deployable on Vercel / Render / VPS

---

## 🧪 Installation Guide

### 🔧 Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run

## ⚙️ Frontend (Next.js + Ant Design)
```bash
cd frontend
npm install
npm run dev
