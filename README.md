# 👜 VIVA BAGS – E-Commerce Platform for Premium Bags

**VIVA BAGS** is a scalable **e-commerce application** designed for premium bags. Built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**, it offers a full-fledged shopping experience including user authentication, product management, offers & coupons modules, cart & checkout, payment processing, and an insightful admin dashboard.

---

## 🌐 Live Demo  
https://viva-bags.vercel.app

---

## 👨‍💻 Developed by  
**Muhammed Shuraif**

---

## 🚀 Features

### 👥 User-Side Functionality

- **Authentication & Security**
  - OTP-based user registration & login
  - Secure password recovery
  - Role-based access control (RBAC)

- **Profile & Account Management**
  - Update personal details
  - Manage wallet balance and transactions
  - View and track past orders

- **Shopping Experience**
  - Advanced product search & filtering
  - Product reviews and ratings
  - Add to cart & wishlist
  - Checkout with order summary

- **Payments & Orders**
  - Integrated **Razorpay** for secure payments
  - Order placing, canceling, and refund handling
  - Wallet and coupon support

---

### 🛠️ Admin-Side Functionality

- **Admin Dashboard**
  - Analytics and insights on users, products, and orders
  - Track sales, revenue, and growth

- **Product Management**
  - Add, update, and remove products
  - Manage product categories
  - View customer reviews and ratings

- **User & Order Management**
  - Manage user accounts (block/unblock)
  - View, update, and monitor orders
  - Force-cancel orders if needed

- **Promotions**
  - Manage coupons and discount rules
  - Create special offers

---

## 🧰 Tech Stack

- **Frontend**: React.js, Redux, Tailwind CSS  
- **Backend**: Node.js, Express.js, MongoDB  
- **Authentication**: JWT, OTP  
- **Payments**: Razorpay  
- **File Storage**: Cloudinary  
- **Deployment**: Docker, AWS, Vercel/Netlify  

---

## 📁 Project Structure

```

viva-bags/
├── client/ # React frontend
│ ├── src/
│ │ ├── api/
│ │ ├── context/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── redux/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── .env
│ └── public/
│
├── server/ # Express backend
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── index.js
│ ├── .env
│ └── utils/
└── README.md

```

---

## 🧪 Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Shuraifp/viva-bags.git
cd viva-bags
```

### 2. Backend Setup
```
cd server
npm install
```

#### Create a .env file in server/ with:

```.env

PORT=<port>
DB_URI=<mongo_uri>
SECRET_KEY=<secret>
FRONTEND_URL=http://localhost:5173
EMAIL_USER=<email_user>
EMAIL_PASS=<email_pass>
RAZORPAY_KEY_ID=<raq_key_id>
RAZORPAY_KEY_SECRET=<raz_key_secret>
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>

```

#### run
``` 
npm run dev
```

### 3. Frontend Setup
```
cd ../client
npm install
npm start

```

The app will run at: http://localhost:5173

#### Create a .env file in client/ with:

```.env

VITE_API_URL=<server_uri>
GOOGLE_CLIENT_ID=<google_client_id>
RAZORPAY_KEY_ID=<rzp_key_id>

```

---

## ⚙️ Prerequisites
```
- Node.js v18+
- MongoDB Atlas or local instance
- Razorpay test keys
- Cloudinary account
```

---
## 📝 License

This project is open-source under the [MIT License](LICENSE).
