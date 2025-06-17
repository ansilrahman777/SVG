# 📊 Super Admin Dashboard with User Access Control

A full-stack web application using **React** and **Django REST Framework** that provides a Super Admin Dashboard for managing users, page-based permissions, and comment histories.

---

## 📌 Overview

This project allows a **Super Admin** to:
- Create and manage user accounts.
- Assign dynamic page-based permissions (View, Create, Edit, Delete).
- Track comment modification history.
- Regular users can access only their assigned pages and actions.

---

## ✨ Key Features

### 🔐 Authentication System
- JWT-based login (access & refresh tokens)
- Separate login pages for Super Admin and regular users
- Password recovery with OTP verification
- 1-hour session expiry on inactivity

### 👥 User Management
- Super Admin can create users with auto-generated strong passwords
- View and update user permissions dynamically
- User-role matrix table showing permissions for each page

### 📄 Page Permissions (Access Control)
- 10 predefined pages:
  1. Products List
  2. Marketing List
  3. Order List
  4. Media Plans
  5. Offer Pricing SKUs
  6. Clients
  7. Suppliers
  8. Customer Support
  9. Sales Reports
  10. Finance & Accounting
- Permission options: View, Create, Edit, Delete

### 💬 Comment Management
- Add, edit, and delete comments based on permissions
- Comments visible to users with view access
- Super Admin can view comment modification history (with tooltip showing who modified and when)

---

## 📂 Project Structure

SuperAdminDashboard/
├── backend/ # Django Backend
├── frontend/ # React Frontend
├── requirements.txt
└── .gitignore


---

## ⚙️ Setup Instructions

### 📥 Clone the Repository
```bash
git clone https://github.com/ansilrahman777/SuperAdminDashboard.git
cd SuperAdminDashboard

#Backend Setup (Django)

cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

#Frontend Setup (React)

cd frontend
npm install
npm run dev


