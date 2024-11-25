import React, { useState, useEffect } from "react";
import { useAuth } from "../../Store/FirebaseAuth";
import { collection, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import styles from "./profile.module.css";
import { usePost } from "../../Store/PostProvider";

const Profile = () => {
  const { currentUser, userData, setUserData } = useAuth();
  const { fetchPosts } = usePost();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ name: "", email: "" });

  useEffect(() => {
    if (userData) {
      setEditedUser({
        name: userData.name,
        email: userData.email,
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      
      // Update the user document
      await updateDoc(userDocRef, {
        name: editedUser.name,
        email: editedUser.email,
      });
  
      // Reference to the posts collection
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", currentUser.uid) // Fetch posts made by the current user
      );
      
      const querySnapshot = await getDocs(postsQuery);
  
      // Batch update to update all the user's posts
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { name: editedUser.name });
      });
  
      await batch.commit(); // Commit the batch update
      fetchPosts();
      toast.success("Profile and posts updated successfully!");
  
      // Update local state
      setUserData((prev) => ({
        ...prev,
        name: editedUser.name,
        email: editedUser.email,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile and posts:", error);
      toast.error("Failed to update profile and posts.");
    }
  };
  

  const handleCancel = () => {
    setEditedUser({
      name: userData.name,
      email: userData.email,
    });
    setIsEditing(false);
  };

  const renderRoleSpecificContent = () => {
    switch (userData?.role) {
      case "superAdmin":
        return <div className={styles.roleSection}>You have full access to all settings.</div>;
      case "admin":
        return <div className={styles.roleSection}>You can manage user posts and moderate content.</div>;
      case "user":
        return <div className={styles.roleSection}>You can create and edit your own posts.</div>;
      default:
        return <div className={styles.roleSection}>Role not recognized.</div>;
    }
  };

  // Ensure that loading state is checked
  if (!userData) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        {!isEditing && (
          <button className={styles.editIcon} onClick={() => setIsEditing(true)}>
            <i className="fa-solid fa-user-pen" />
          </button>
        )}

        <h2 className={styles.title}>Your Profile</h2>

        {isEditing ? (
          // Editable Form
          <div className={styles.editForm}>
            <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Enter Full Name..."
            />
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Enter Email Address..."
            />
            <button className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
            <button className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          // Display User Info
          <table className={styles.profileTable}>
            <tbody>
              <tr>
                <td><strong>Name:</strong></td>
                <td>{userData.name}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{userData.email}</td>
              </tr>
              <tr>
                <td><strong>Role:</strong></td>
                <td>{userData.role}</td>
              </tr>
              <tr>
                <td><strong>Total Posts:</strong></td>
                <td>{userData.postsCreated || 0}</td>
              </tr>
              <tr>
                <td><strong>Member Since:</strong></td>
                <td>{userData.createdAt}</td>
              </tr>
            </tbody>
          </table>
        )}

        {renderRoleSpecificContent()}

        {userData.role === "superAdmin" && (
          <div className={styles.adminActions}>
            <button className={styles.button}>Manage Users</button>
            <button className={styles.button}>Moderate Content</button>
          </div>
        )}
        {userData.role === "admin" && (
          <div className={styles.adminActions}>
            <button className={styles.button}>Moderate Content</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
