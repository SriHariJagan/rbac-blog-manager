
# 🛡️ **Role-Based Access Control (RBAC) Blog Manager**

An interactive **Role-Based Access Control (RBAC)** system built with **React**, designed to manage user access and permissions for a blog platform. The application leverages Firebase for authentication and Firestore for data management.

---

## 🚀 **Features**

- **Role Management:** Three roles—Super Admin, Admin, and User.
- **Blog Management:** Create, edit, delete, and view blogs with role-based permissions.
- **User Authentication:** Secure login and role verification using **Firebase Authentication**.
- **Real-Time Updates:** Changes made by one user are reflected in real-time for all users.
- **Dynamic UI:** Displays role-specific views for users, admins, and super admins.
- **Permissions:** Granular control over which users can manage, view, or edit content based on their roles.

---

## 👤 **User Roles & Access Levels**

### 🔹 **Super Admin**
- **Manage users and admins**: Add, edit, delete Posts, and change user roles.
- **Access to all blogs**: View and manage all posts across the platform.
- **Create/Edit/Delete Posts**: Full control over the platform’s user base.

### 🔹 **Admin**
- **View all users and blogs**: Admins can view all users and their blogs.
- **Edit any blog post**: Admins have the ability to modify any blog post on the platform.

### 🔹 **User**
- **Create and Edit Own Blogs**: Users can write, edit, and manage their own blog posts.
- **View Own Posts**: Users can manage only their posts.
- **No Admin Rights**: Cannot edit posts of other users.

---

## 🔐 **Login Details**

### Super Admin
- **Email:** `superadmin@gmail.com`  
- **Password:** `123456`  

### Admin
- **Email:** `admin@gmail.com`  
- **Password:** `123456`  

### User
- **Email:** `user@gmail.com`  
- **Password:** `123456`  

> **Note:** These are sample credentials for demonstration purposes. You can also create your own account through the signup page to explore the application with personalized access.

---

## 🛠️ **Tech Stack**

- **Frontend:** 
  - **React:** A JavaScript library for building user interfaces.
  - **CSS Modules:** Scoped CSS for styling React components.
  
- **State Management:** 
  - **React Context API:** For managing global state like user authentication and blog data.
  
- **Backend:** 
  - **Firebase Authentication:** Secure login system with role-based access.
  - **Firebase Firestore:** Real-time NoSQL database for storing user data and blog posts.

---

## 📦 **Setup & Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SriHariJagan/rbac-blog-manager.git
   cd react-rbac-blog-manager
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Obtain your Firebase config object and replace the `firebaseConfig` in the project with your credentials.

4. **Start the development server:**
   ```bash
   npm start
   ```
   Visit `http://localhost:3000` in your browser to run the application.

---

## 🔗 Live Demo

You can try out the live demo of the project here:

[**Live Demo Link**](https://rbca-blogmanager.netlify.app/)

---

## 📸 **Screenshots**

![image](https://github.com/user-attachments/assets/c84b8a14-d78f-4afd-9d9c-a6aaebbf4733)

<br />

![image](https://github.com/user-attachments/assets/3539a137-ca98-41bc-a098-d23c8b742803)

<br />

![image](https://github.com/user-attachments/assets/18d1627e-fc57-4ee1-b16a-61d2643f8353)


