# Dropify - Full-Stack E-Commerce Platform
Dropify is a complete, full-stack e-commerce web application designed for selling content creator merchandise. Built with the Vue 3 Composition API on the frontend and a powerful Node.js/Express/MongoDB backend, it provides a seamless experience for both customers and administrators.

The platform features a rich, dynamic user interface with smooth transitions and animations, a secure authentication system, a persistent user-specific shopping cart, and a comprehensive admin panel for managing products, users, and orders.

---

## Features

### 👤 Customer-Facing Features
- **Secure Authentication:** User registration and login with JWT-based sessions.
- **Case-Insensitive Login:** Users can log in without worrying about capitalization.
- **Dynamic Homepage:** Features a hero section, a grid of featured products fetched from the backend, and brand information.
- **Product Browsing:** Separate, filterable pages for Shirts, Hoodies, and Caps.
- **Live Search & Sort:** Instantly search for products by name and sort by price or date on shop pages.
- **User-Specific Shopping Cart:** The cart is tied to the user's account and persists across sessions and logouts.
- **Full Cart Functionality:** Add to cart, remove from cart, and update quantities with `+`/`-` buttons or by typing.
- **Checkout Process:** A multi-step checkout flow with a form for shipping details that creates a permanent order record.
- **Polished UI/UX:**
    - Smooth page transitions and staggered animations for product grids.
    - Interactive hover effects on product cards.
    - A "sticky" header that transitions from transparent to solid on scroll.
    - Custom pop-up notifications for a professional feel.

### 👑 Admin-Only Features
- **Role-Based Access Control:** A secure admin panel accessible only to users with the `isAdmin` flag.
- **Separate Admin Login:** A dedicated "Admin Login" tab for clarity, which rejects non-admin users.
- **Product Management (CRUD):**
    - Create, Read, Update, and Delete any product in the store via a modal interface.
    - Search, sort, and filter products by category.
    - Pagination to efficiently manage a large number of products.
- **User Management:**
    - View a list of all registered users.
    - Search and sort users by registration date, last login, or username.
    - Promote regular users to admins or demote other admins.
    - Delete user accounts.
- **Order Management:**
    - View a list of all orders placed on the site.
    - Search and sort orders by customer or total price.
    - View detailed order information (customer, shipping address, items) in a modal.
    - Update order status (e.g., from `Processing` to `Shipped`).
    - Delete orders.

---

## 🛠 Tech Stack

- **Frontend:**
  - **Vue 3** (Composition API with `<script setup>`)
  - **Vue Router** for client-side routing.
  - **Pinia** for centralized state management.
  - **Axios** for making API requests.
- **Backend:**
  - **Node.js** with **Express** for the REST API.
  - **MongoDB** with **Mongoose** for the database.
  - **JSON Web Tokens (JWT)** for secure authentication.
  - **bcrypt.js** for password hashing.
  - **CORS**, **dotenv**.
- **Development:**
  - **Vite** for the frontend development server.
  - **Nodemon** for the backend development server.

---

## 🚀 Project Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- A running [MongoDB](https://www.mongodb.com/) instance (local or a free cloud instance from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a file named `.env` in the `backend` directory and add the following variables. **Replace the placeholder values.**

    ```
    # Your MongoDB Atlas connection string or local DB string
    MONGO_URI=mongodb+srv://<username>:<password>@yourcluster.mongodb.net/dropify

    # A long, random, secret string for JWT
    JWT_SECRET=your_super_secret_jwt_key

    # Optional: Change the port the server runs on
    PORT=5000
    ```
    > **Security Note:** Ensure your MongoDB Atlas cluster has your current IP address whitelisted under "Network Access".

4.  **Seed the database with initial products:**
    This command will wipe the existing products and populate the database with the items defined in `backend/utils/seeder.js`.
    ```bash
    node utils/seeder.js
    ```

5.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The backend API will now be running, typically at `http://localhost:5000`.

### 2. Frontend Setup

1.  **Navigate to the frontend (root) directory:**
    Open a **new, separate terminal** and navigate to the root `vue-project` folder.

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend server:**
    ```bash
    npm run dev
    ```
    The Vue application will now be running, typically at `http://localhost:5173`.

### 3. Creating an Admin User

Admin access is granted manually for security.
1.  **Register a new user** on the website through the "Create Account" form.
2.  **Log out** immediately.
3.  **Connect to your MongoDB database** (e.g., via Atlas "Browse Collections").
4.  Navigate to the `users` collection.
5.  Find the user you just created and edit their document.
6.  Add a new field named `isAdmin`, set its type to `Boolean`, and set the value to `true`.
7.  Save the change. You can now log in with this user on the "Admin Login" tab to access the admin panel.