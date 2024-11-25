import React, { useState, useEffect } from "react";
import { usePost } from "../../Store/PostProvider"; // Import the usePost hook
import styles from "./createForm.module.css";

const CreateForm = ({ setFormShow, postData }) => {
  const { createPost, updatePost } = usePost();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // If postData is provided, we're in edit mode
  const isEditMode = postData != null;

  useEffect(() => {
    if (postData) {
      setTitle(postData.title);  // Pre-fill form with post data
      setDescription(postData.description);
    } else {
      // Reset form if no postData
      setTitle("");
      setDescription("");
    }
  }, [postData]);  // Run this whenever postData changes

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title && description) {
      if (isEditMode) {
        // Update the post if in edit mode
        updatePost(postData.id, title, description);
      } else {
        // Create new post
        createPost(title, description);
      }

      setTitle("");  // Clear the form after submission
      setDescription("");
      setFormShow(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.createForm} onSubmit={handleSubmit}>

      <button className={styles.closeBtn} onClick={() => setFormShow(false)}>
        <i className="fa-solid fa-xmark" />
      </button>

        <h2 className={styles.formTitle}>{isEditMode ? "Edit Post" : "Create New Post"}</h2>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Title
          </label>
          <input
            type="text"
            id="title"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
            maxLength={30}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter post description"
            rows="5"
            required
            maxLength={276}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          {isEditMode ? "Update Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreateForm;
