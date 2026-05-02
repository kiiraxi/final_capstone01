# Cedula E-service portal

Overview

This project is a web-based system designed to streamline the application process for **Community Tax Certificate (Cedula)** ain the Philippines. It allows users to submit forms online, authenticate securely using OTP, and store data in a MySQL database.

The system is built using **Node.js, Express, MySQL, and EJS**, and is deployed using **Render** with database integration.

---
Team Members
Karen Alloones – Lead Programmer


Responsibilities:

System architecture and backend development
Database design and integration (MySQL)
OTP authentication system
API/routes development
Deployment and server configuration

Alh Jane Baricuatro– UI/UX Designer and Documentor

Responsibilities:

UI/UX design and interface layout
Frontend development using EJS and Bootstrap 5.3
Form design and user experience optimization

Ma. Lynn Gayuna – Documenter

Responsibilities:
System analysis and documentation of requirements
Testing documentation and summaries

---

 Features

Authentication

* User login system
* OTP (One-Time Password) verification via email before form submission
* Secure session handling

Form Management

* Cedula (Community Tax Certificate) application form
* File upload support (e.g., images/documents)
* Duplicate submission prevention

Database Integration

* MySQL database (local + Render compatible)
* Data insertion for forms and user records
* Connected via environment variables (.env)

Document Output

* Printable form layouts
* Official receipt-style PTR template
* PDF export support using jsPDF and html2canvas

---

Tech Stack

* **Backend:** Node.js, Express.js
* **Frontend:** EJS, HTML, CSS, Bootstrap 5.3
* **Database:** MySQL (DBeaver for management)
* **Email Service:** Nodemailer (OTP system)
* **Deployment:** Render
* **File Uploads:** Multer

---

 Project Structure

```
project-root/
│
├── public/              # Static files (CSS, JS, images)
├── views/               # EJS templates
├── routes/              # Express routes
├── controllers/         # Logic handling
├── config/              # Database configuration
├── uploads/             # Uploaded files
├── app.js               # Main server file
├── .env                 # Environment variables
└── package.json
```

---

Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```
PORT=5432
DB_HOST=dpg-d78nd2qdbo4c738acelg-a
DB_USER=capstone01_user
DB_PASSWORD=JljPUmSeonKIQ0chYoFvifvQio7xINTz
DB_NAME=capstone01
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### 4. Run the application

```bash
npm start
```

For development:

```bash
npm run dev
```

---

##  Database Setup

You can use either:

* Local MySQL (via XAMPP or MySQL Workbench)
* Cloud MySQL (Render / other hosting)

Tables include:

* `users`
* `form`
* `ptr_form`

---

##  OTP Flow

1. User logs in
2. User fills out form
3. Before submission, OTP is sent to registered email
4. User verifies OTP
5. Data is saved in database

---

##  Deployment

This project is deployed on **Render**:

* Backend service: Node.js
* Database: Render PostgreSQL/MySQL (or external DB)

---

##  Future Improvements

* Admin dashboard for managing applications
* SMS OTP verification
* Role-based access control
* Enhanced UI/UX design

---

##  Developer Notes

This project was created as a **Capstone Requirement** focused on digitizing local government document processing in the Philippines.

---

##  License

This project is for academic purposes only.
