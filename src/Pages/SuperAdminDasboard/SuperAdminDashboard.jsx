import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';  // Firebase import
import { collection, getDocs, doc, deleteDoc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import UserTable from './UserTable/UserTable'; // UserTable import
import styles from './superAdminDashboard.module.css'; // CSS module import
import { usePost } from '../../Store/PostProvider';
import { toast } from 'react-toastify';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);

  const { fetchPosts } = usePost();

  console.log(users);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

 // Delete user and their posts from Firestore
 const deleteUser = async (userId) => {
  try {
    // Step 1: Delete all posts by the user
    const postsRef = collection(db, 'posts');
    const userPostsQuery = query(postsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(userPostsQuery);
    
    const deletePostPromises = querySnapshot.docs.map(async (postDoc) => {
      await deleteDoc(doc(db, 'posts', postDoc.id));
    });

    await Promise.all(deletePostPromises);

    // Step 2: Delete the user document
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const userName = userDoc.data().name;
    await deleteDoc(userDocRef);

    // Update local users state
    setUsers(prevState => prevState.filter(user => user.id !== userId));

    // Refresh posts state to reflect the deleted posts
    await fetchPosts();  // Refresh posts after deletion

    toast.success(`User ${userName} and their posts deleted successfully.`);
  } catch (error) {
    console.error("Error deleting user and posts:", error);
    toast.error("Error deleting user and their posts.");
  }
};

  // Update user role in Firestore
  const updateUserRole = async (userId, newRole) => {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, { role: newRole });
    setUsers(prevState => prevState.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    )); // Update user role in state
  };

  // Toggle user disabled state
  const onToggleDisable = async (userId, isDisabled) => {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, { disabled: isDisabled }); // Update Firestore disabled field
    setUsers(prevState => prevState.map(user => 
      user.id === userId ? { ...user, disabled: isDisabled } : user
    )); // Update disabled state in local state
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.tableContainer}>
        <UserTable 
          users={users} 
          onDeleteUser={deleteUser} 
          onUpdateRole={updateUserRole}
          onToggleDisable={onToggleDisable} 
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
