# Student Complaint System

A MERN stack application designed to manage and resolve student complaints efficiently. This system allows students to submit complaints, track their status, and enables administrators to manage and address issues.

## Technology Stack

**Client:**
- React (via Vite)
- Tailwind CSS
- React Router DOM
- Axios

**Server:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT) for authentication
- Cloudinary (for image uploads)
- Multer (for file handling)

## Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd amsd-project
```

### 2. Install Dependencies
You need to install dependencies for both the root (concurrently), the server, and the client.

**Root:**
```bash
npm install
```

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd ../client
npm install
```

## Configuration

Crucial: You must set up environment variables for the server to run correctly.

1.  Navigate to the `server` directory.
2.  Create a `.env` file (if it doesn't exist) based on the example below.

**server/.env**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Note:** Replace the placeholder values with your actual credentials.

## Running the Application

To run both the server and client concurrently from the root directory:

```bash
# From the project root
npm run dev
```

- **Server:** Runs on `http://localhost:5000`
- **Client:** Runs on `http://localhost:5173` (default Vite port)

Alternatively, you can run them separately in two different terminals:

**Terminal 1 (Server):**
```bash
cd server
npm start
# or for development with auto-restart (requires nodemon)
npm run dev
```

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```

## Project Structure

- `client/`: React frontend application.
- `server/`: Node.js/Express backend API.
- `package.json` (Root): Scripts to run both client and server.
