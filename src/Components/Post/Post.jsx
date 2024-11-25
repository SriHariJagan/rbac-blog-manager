import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import styles from './post.module.css';
import { usePost } from '../../Store/PostProvider';
import { useAuth } from '../../Store/FirebaseAuth';

const Post = ({ post, setFormShow, setEditData }) => {
  const { deletePost, updateLike } = usePost();
  const { currentUser, role, userData } = useAuth();

  const isUserDisabled = userData ? userData.disabled : false;

  const navigate = useNavigate();

  const handleEdit = () => {
    setFormShow(true);
    setEditData(post);
  };

  const handleDelete = () => {
    deletePost(post.id);
  };

  const handleLike = () => {
    if (isUserDisabled) {
      toast.info('You are disabled. You cannot like posts.');
      return;
    }
    if (currentUser) {
      updateLike(post.id);
    } else {
      toast.info('Please log in to like posts.');
      navigate('/login');
    }
  };

  // Check if the current user is authorized to edit/delete
  const isAuthorized =
    currentUser && !isUserDisabled &&
    (currentUser.uid === post.userId ||
      role?.toLowerCase() === 'admin' ||
      role?.toLowerCase() === 'superadmin');

      const roleColor = styles[post.role.toLowerCase()]|| " ";

  return (
    <div className={`${styles.postContainer} ${roleColor}`}>
      <span className={styles.userName}>Created By: <b>{post.name} ({post.role})</b></span>
      <div className={styles.postTitle}>
        <h2>Title:</h2> 
        <p>{post.title}</p>
      </div>
      <div className={styles.postDescription}>
        <h3>Description:</h3>
        <p>{post.description}</p>
      </div>
      <div className={styles.likeModify}>
        <div className={styles.like} onClick={handleLike}>
          <i
            className={`${currentUser && post.likedUsers.includes(currentUser.uid) ? "fa-solid fa-heart" : "fa-regular fa-heart"}`}
          />
          <span>{post.likes}</span>
        </div>
        <div className={styles.modify}>
          {isAuthorized && (  // Show buttons only if authorized
            <>
              <button 
                className={styles.editBtn} 
                onClick={handleEdit} 
                disabled={isUserDisabled} // Disable edit button if user is disabled
              >
                <i className="fa-solid fa-pen-to-square" />
              </button>
              <button 
                className={styles.deletBtn} 
                onClick={handleDelete} 
                disabled={isUserDisabled} // Disable delete button if user is disabled
              >
                <i className="fa-solid fa-trash-can" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
