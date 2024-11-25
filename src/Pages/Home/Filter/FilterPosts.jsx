// FilterPosts.js
import React, { useState } from 'react';
import styles from './filterPost.module.css';
// import { useAuth } from '../../../Store/FirebaseAuth';
import { usePost } from '../../../Store/PostProvider';

const FilterPosts = ({ setFilteredPosts }) => {
  const { posts } = usePost();  // Get posts from the Post context
//   const { userData } = useAuth(); 

  const [filterType, setFilterType] = useState('');  // Dropdown for filter type (usertype, title, username, likes)
  const [userRoleFilter, setUserRoleFilter] = useState('');  // Usertype filter (superAdmin, admin, user)
  const [inputText, setInputText] = useState('');  // Input field for title/username

  // Function to handle the filter logic
  const handleFilterChange = () => {
    let filtered = [...posts];  // Start with all posts

    if (filterType === 'usertype' && userRoleFilter) {
      filtered = filtered.filter(post => post.role === userRoleFilter);
    }

    if (filterType === 'title' && inputText) {
      filtered = filtered.filter(post => post.title.toLowerCase().includes(inputText.toLowerCase()));
    }

    if (filterType === 'username' && inputText) {
      filtered = filtered.filter(post => post.name.toLowerCase().includes(inputText.toLowerCase()));
    }

    if (filterType === 'likes') {
      // Directly apply the likes sorting when "Likes" filter is selected
      filtered = filtered.sort((a, b) => b.likes - a.likes);
    }

    setFilteredPosts(filtered);  // Pass the filtered posts to the parent component
  };

  return (
    <div className={styles.filterContainer}>
      <select 
        value={filterType} 
        onChange={(e) => setFilterType(e.target.value)} 
        className={styles.select}
      >
        <option value="">Select Filter</option>
        <option value="usertype">User Type</option>
        <option value="title">Title</option>
        <option value="username">Username</option>
        <option value="likes">Likes</option>
      </select>

      {filterType === 'usertype' && (
        <select 
          value={userRoleFilter} 
          onChange={(e) => setUserRoleFilter(e.target.value)} 
          className={styles.select}
        >
          <option value="">Select User Type</option>
          <option value="superAdmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      )}

      {(filterType === 'title' || filterType === 'username') && (
        <input 
          type="text" 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          className={styles.input} 
          placeholder={`Search by ${filterType}`} 
        />
      )}

      {filterType === 'likes' && (
        <button onClick={handleFilterChange} className={styles.filterButton}>
          Apply Like Sort
        </button>
      )}

      {(filterType !== 'likes') && (
        <button onClick={handleFilterChange} className={styles.filterButton}>
          Apply Filter
        </button>
      )}
    </div>
  );
};

export default FilterPosts;
