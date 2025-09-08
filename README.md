🧑‍💼 Online Job Portal

A full-stack job portal application built using React.js, Node.js, Express, MySQL, Bootstrap, and CSS.
This platform connects job seekers, HRs, and Admins in a smooth hiring process with role-based dashboards.

🚀 Features

🔐 Authentication & Authorization for Admin, HR, and User roles

👤 User Dashboard:

Update profile

Search and apply for jobs

Track applications

🧑‍💻 HR Panel:

Post and manage job openings

View and shortlist candidates

Schedule interviews (Online via Google Meet / Offline via Address)

🧑‍💻 Admin Panel:

Manage HRs and Users

View statistics (job count, application count, charts)

Maintain system access

📊 Statistics Dashboard:

Job postings count

Applications received

Visual charts for insights

📧 Email Notifications via NodeMailer

🎨 Responsive UI with Bootstrap & CSS

Tech Stack

Frontend: React.js, Bootstrap, CSS
Backend: Node.js, Express.js
Database: MySQL
Other Tools: Nodemailer, JWT Authentication

📂 Project Structure
JobPortal/
 ├── backend/          # Node.js + Express API
 ├── frontend/         # React app
 ├── README.md         # Project documentation
 └── ...

⚙️ Installation

Clone the repository

git clone https://github.com/yourusername/jobportal.git
cd jobportal


Backend Setup

cd backend
npm install
npm start


Frontend Setup

cd frontend
npm install
npm start


Database Setup (MySQL)

Create a database jobportal_db

Import the provided .sql file (if you have one)

Configure DB credentials in backend/config/db.js

Environment Variables (Backend) → create .env file

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=jobportal_db
JWT_SECRET=your_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

📸 Screenshots

(Add screenshots of Login, User Dashboard, HR Panel, Admin Panel, Job Posting, etc.)

📧 Contact

Developed by Your Name
🔗 LinkedIn
 | GitHub
