// Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import CreateForm from '../../Components/CreateForm/CreateForm';
import Post from '../../Components/Post/Post';
import { usePost } from '../../Store/PostProvider';
import { useAuth } from '../../Store/FirebaseAuth';
import FilterPosts from './Filter/FilterPosts';

const Home = () => {
  const [formShow, setFormShow] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);  // State to store filtered posts
  const { posts } = usePost();
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  // Apply initial filter to posts when the component loads
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  const handleForm = () => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setFormShow(true);
      setEditData(null);
    }
  };

  const isUserDisabled = userData ? userData.disabled : false;

  return (
    <div className={styles.container}>

      <div className={styles.homeFilterCreatePost}>
              {/* Filter Section */}
          <div className={styles.filter}>
            <FilterPosts setFilteredPosts={setFilteredPosts} />
          </div>

              {/* Create Post Button */}
          <div className={styles.createPost}>
            <abbr title={isUserDisabled ? "You are not allowed to create a post" : "Click here to create a new post"}>
              <button 
                className={styles.createPostBtn} 
                onClick={handleForm} 
                disabled={isUserDisabled}
              >
                <i className="fa-solid fa-plus" />
              </button>
            </abbr>
          </div>
      </div>


      <div className={styles.postsContainer}>
        {filteredPosts.map(post => (
          <Post 
            key={post.id} 
            post={post} 
            setFormShow={setFormShow} 
            setEditData={setEditData} 
          />
        ))}
      </div>

      {formShow && <CreateForm setFormShow={setFormShow} postData={editData} />}
    </div>
  );
};

export default Home;
