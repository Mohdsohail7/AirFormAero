# AirFormAero   

A form builder with **Airtable integration** that allows users to create, customize, and manage forms with **conditional logic** and **OAuth authentication**.  

---

## 🚀 Features  

- **Airtable OAuth Authentication**  
  Securely connect your Airtable account using OAuth2.  

- **Dynamic Form Builder**  
  Create forms with text inputs, dropdowns, checkboxes, file uploads, etc.  

- **Conditional Logic**  
  Show or hide fields based on user responses.  

- **Submission Handling**  
  Store responses in Airtable automatically.  

- **Media Support**  
  File uploads supported via **Cloudinary**.  

- **Session Management**  
  Secure sessions using `express-session` and MongoDB.  

---

## ⚙️ Setup Instructions  

### 1. Clone the Repository  
```bash
git clone https://github.com/Mohdsohail7/AirFormAero.git
cd AirFormAero

## 2. Backend Setup
cd backend
npm install
Create a .env file inside backend/ with the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret

# Airtable OAuth
AIRTABLE_CLIENT_ID=your_airtable_client_id
AIRTABLE_CLIENT_SECRET=your_airtable_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:5000/auth/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Run the backend:
```bash 
npm run dev

## 3. Frontend Setup
```bash
cd frontend
npm install
Create a .env file inside frontend/ with:
``` bash
REACT_APP_BACKEND_URL=http://localhost:4000

Run the frontend:
npm start

backend + frontend run together
npm start

## 🔑 Airtable OAuth Setup Guide

Go to Airtable Developers and create a new OAuth integration.

Configure Redirect URI as:
http://localhost:4000/auth/callback

Copy Client ID and Client Secret into your backend .env.
When users log in, they’ll be redirected to Airtable for authentication.

## 🧩 Conditional Logic Explanation

Conditional logic allows you to show/hide fields in your form depending on user input.

Example:

Question 1: "Do you have a passport?" (Yes/No)

If Yes → Show "Enter passport number" field.

If No → Skip passport number and go to next question.

This is implemented in the frontend by checking responses and dynamically rendering form fields.

📸 Screenshots & Demo
project live url--> https://air-form-aero-gz7x.vercel.app/

## 🛠️ Tech Stack

Frontend: React, Axios

Backend: Node.js, Express, MongoDB

OAuth & API: Airtable API

File Uploads: Cloudinary

Session Handling: express-session + MongoDB