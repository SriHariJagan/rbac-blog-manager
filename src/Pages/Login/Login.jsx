import React, { useState } from "react";
import { useAuth } from "../../Store/FirebaseAuth"; // Import the FirebaseAuth
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth(); // Destructure the login function from FirebaseAuth

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill out all fields");
      return;
    }
    setError("");
    setLoading(true); // Start loading

    try {
      await login(formData.email, formData.password, navigate); // Call login from FirebaseAuth
      // Handle successful login
      setLoading(false); // Stop loading
    } catch (error) {
      setError("Invalid email or password");
      setLoading(false); // Stop loading even on error
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
