## Vibe Commerce Mock Shopping Cart

This project is a fully functional, basic full-stack implementation of an e-commerce shopping cart, built as a technical screening assignment for Vibe Commerce.

The application allows users to view a list of products, add or remove items from a persistent shopping cart, calculate real-time totals (including mock shipping and taxes), and complete a mock checkout process that generates a final receipt

## Deliverables

Requirement,Status,Location
Full Stack Implementation (MERN),Complete,/backend and /frontend
REST API Endpoints,Complete,/backend/server.js
DB Persistence (MongoDB),Complete,/backend/models/
Responsive Frontend (React),Complete,/frontend/src/
README & Setup Guide,Complete,README.md

## Tech Stack
Layer,Technology,Key Libraries/Tools
Frontend,React,"react-router-dom, axios, CSS Modules"
Backend,Node.js (Express),"express, cors, dotenv"
Database,MongoDB,mongoose (ORM)

## Project Structure & Setup

The project is split into two main directories: backend (Node/Express API) and frontend (React client).

1. Prerequisites
Before starting, ensure you have the following installed:

Node.js (v18+)

MongoDB (Local instance or a Cloud Atlas URI)

2. Backend Setup (API & Database)
Navigate to the backend directory:

cd backend
Install dependencies:

npm install
Configure Environment Variables: Create a file named .env in the backend folder and add your MongoDB connection string and port:

MONGO_URI="your database url"
PORT=5000
Start the Server:

npm run dev  # (Uses nodemon for development)
# OR
npm start
The server will start on http://localhost:5000 and automatically seed the initial product data into your MongoDB database if it's empty.

3. Frontend Setup (React Client)
Navigate to the frontend directory:


cd ../frontend
Install dependencies:


npm install
Start the React App:


npm start
The application will open in your browser at http://localhost:5173.

## Application Flow & API Design

The application provides a seamless e-commerce journey driven by a set of RESTful APIs

## Key API Endpoints

Method,Endpoint,Description
GET,/api/products,Retrieves the list of available products.
POST,/api/cart,Adds a new item or increments the quantity of an existing item in the cart.
PUT,/api/cart/:id,Updates the quantity of a specific cart item (:id is the CartItem ID).
DELETE,/api/cart/:id,Removes a specific item from the cart.
GET,/api/cart,"Retrieves all cart items, calculates totals (subtotal, shipping, taxes, total), and returns the summary."
POST,/api/checkout,"Accepts customer details, calculates the final total, clears the cart in the DB, and generates a mock receipt"


