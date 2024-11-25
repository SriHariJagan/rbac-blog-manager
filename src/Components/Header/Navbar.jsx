import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../Store/FirebaseAuth"; // Import the AuthContext
import styles from "./navbar.module.css";

const Navbar = () => {
  const { currentUser, logout, role } = useAuth(); // Get the currentUser and loginStatus from context
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!currentUser); // Double negation to convert to boolean
  }, [currentUser]);

  const isAdminOrSuperAdmin = role && (role === "admin" || role === "superAdmin");

  const handleSignOut = () => {
    logout();
    setIsLoggedIn(false);
  };
  

  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          {isLoggedIn && ( // Conditionally render links for logged-in users
            <div className={styles.leftSide}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <li className={styles.navItem}>Home</li>
              </NavLink>

              <NavLink
                to="/myPosts"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <li className={styles.navItem}>My Posts</li>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <li className={styles.navItem}>Profile</li>
              </NavLink>

              {isAdminOrSuperAdmin && ( // Conditionally render Dashboard for Admin or SuperAdmin
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                >
                  <li className={styles.navItem}>Dashboard</li>
                </NavLink>
              )}
            </div>
          )}

          <div className={styles.rightSide}>
            {isLoggedIn ? (
              // Show SignOut button when logged in
              <button className={styles.signOutBtn} onClick={() => handleSignOut()}>
                Sign Out
              </button>
            ) : (
              // Show Login and Signup buttons when not logged in
              <div className={styles.loginOptions}>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                >
                  <li className={styles.navItem}>Login</li>
                </NavLink>

                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                >
                  <li className={styles.navItem}>Signup</li>
                </NavLink>
              </div>
            )}
          </div>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
