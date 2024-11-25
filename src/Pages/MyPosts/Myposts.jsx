import React from 'react';
import styles from './myposts.module.css';
import { usePost } from '../../Store/PostProvider';
import { useAuth } from '../../Store/FirebaseAuth';
import Post from '../../Components/Post/Post'; 

const Myposts = () => {
  const { posts } = usePost();
  const { currentUser } = useAuth();

  // Filter posts to include only those created by the current user
  const userPosts = posts.filter(post => post.userId === currentUser?.uid);

  return (
    <div className={styles.myPostsContainer}>
      {userPosts.length > 0 ? (
        userPosts.map(post => (
          <div className={styles.myPostsPost}><Post key={post.id} post={post} /></div>
        ))
      ) : (
        <p className={styles.noPostsMessage}>You have not created any posts yet.</p>
      )}
    </div>
  );
};

export default Myposts;
