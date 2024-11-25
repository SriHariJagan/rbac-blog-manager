// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { toast } from "react-toastify";

// Create the context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

 
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setLoading(true);
        if (user) {
          setCurrentUser(user);
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              setRole(userDoc.data().role);
              setUserData(userDoc.data())
            } else {
              setRole("user");
              setUserData(null);
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
          }
        } else {
          setCurrentUser(null);
          setRole("guest");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [currentUser]);
  
  
  

  // Function to Signup the user
  const Signup = async (name, email, password, role, navigate) => {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and Password are required");
      }
  
      // Check if the user already exists
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      setUserData(userDoc.data())
  
      const date = new Date();
  
      // If user document does not exist, create it
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: name,
          email: email,
          role: role,
          postsCreated: 0,
          createdAt: date.toLocaleDateString(),
          disabled: false,
        });
  
        toast.success("User registered and data saved in Firestore");
      } else {
        // User document exists, maybe it was previously deleted
        toast.info("User already exists. Restoring user data.");
        // You can update user data here if necessary
      }
  
      // Navigate to login page after successful registration
      return navigate("/login");
    } catch (error) {
      console.log("Error in Signup:", error);
      toast.error("Signup failed, please try again.");
    }
  };
  


 // Function to Login the user
  const login = async (email, password, navigate) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
     
  
      if (!userDoc.exists()) {
        try {

          console.log("User data not found");
          await deleteUser(user); 
          toast.info("Your account has been deleted By ADMIN. Please create a new account.");
  
          return navigate('/signup');
        } catch (error) {
          console.log("Error in deleting user:", error);
          toast.error("There was an error deleting the account.");
          return;
        }
      }
  
      setRole(userDoc.data().role);
      setUserData(userDoc.data())
      
      toast.success("Login successful!");
      navigate("/");
  
      return userCredential.user;
    } catch (error) {
      console.error("Error logging in:", error.message);
  
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        toast.info("User credentials not found or incorrect password.");
      } else {
        toast.error("An error occurred during login.");
      }
  
      throw error;
    }
  };

  // Function to log out the user
  const logout = async () => {
    await signOut(auth);
    setRole(null); 
  };

  return (
    <AuthContext.Provider
      value={{ Signup, login, currentUser, logout, role, userData, setUserData }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
