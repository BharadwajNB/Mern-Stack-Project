# Student Complaint System

A MERN stack application designed to manage and resolve student complaints efficiently. This system allows students to submit complaints, track their status, and enables administrators to manage and address issues.

---

## 🚀 Tech Stack

### 💻 Client

<p align="left">
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,js" />
</p>

* React (via Vite)
* Tailwind CSS
* React Router DOM
* Axios

---

### ⚙️ Server

<p align="left">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />
</p>

* Node.js
* Express.js
* MongoDB (Mongoose)

---

### 🔐 Authentication & Tools

<p align="left">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Multer-FF6C37?style=for-the-badge" />
</p>

---

## 📦 Prerequisites

Ensure you have the following installed:

* Node.js (v14 or higher recommended)
* MongoDB (Local or Atlas)

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd amsd-project
```

### 2. Install Dependencies

#### Root:

```bash
npm install
```

#### Server:

```bash
cd server
npm install
```

#### Client:

```bash
cd ../client
npm install
```

---

## 🔑 Configuration

Create a `.env` file inside the **server** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace placeholders with your actual credentials.

---

## ▶️ Running the Application

### Run both client & server:

```bash
npm run dev
```

* Server → [http://localhost:5000](http://localhost:5000)
* Client → [http://localhost:5173](http://localhost:5173)

---

### Run separately

#### Terminal 1 (Server)

```bash
cd server
npm run dev
```

#### Terminal 2 (Client)

```bash
cd client
npm run dev
```

---

## 📁 Project Structure

```
client/   → React frontend  
server/   → Node.js/Express backend  
```

---

## 📌 About

Complaint Management System built with Node.js, Express, and MongoDB that allows users to submit complaints and admins to manage, update, and resolve them with real-time status tracking and structured workflows.

---
