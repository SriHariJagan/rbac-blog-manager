import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./FirebaseAuth";
import { deleteDoc, doc, updateDoc, getDocs, collection, addDoc, getDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

const PostContext = createContext();

export const usePost = () => {
    return useContext(PostContext);
}

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);  // State to hold the posts
    const { userData, currentUser } = useAuth();

    console.log(userData)

    // Fetch posts from Firestore on initial load
    const fetchPosts = async () => {
        try {
            const postsCollectionRef = collection(db, "posts");
            const postsSnapshot = await getDocs(postsCollectionRef);
            const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsList);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Create post both in Firestore and in local state
    const createPost = async (title, description) => {
        try {
            const newPost = {
                title,
                description,
                name: userData.name,
                likes: 0,
                likedUsers : [],
                userId: currentUser.uid,
                createdAt: new Date().toLocaleDateString(),
                role: userData.role
            };

            // Create a reference to the "posts" collection
            const postsCollectionRef = collection(db, "posts");

            // Add a new post document with an auto-generated unique ID
            const docRef = await addDoc(postsCollectionRef, newPost);

            // Update local state with the new post (using docRef.id as the unique ID)
            setPosts(prevPosts => [
                ...prevPosts,
                { id: docRef.id, ...newPost }
            ]);

            const userDocRef = doc(db, "users", currentUser.uid);
            await updateDoc(userDocRef, {
                postsCreated: increment(+1)
            });

            toast.success("Post created successfully!");
        } catch (error) {
            console.log("Error while creating post", error);
            toast.error("Error while creating post.");
        }
    };

    // Update post both in Firestore and in local state
    const updatePost = async (postId, updatedTitle, updatedDescription) => {
        try {
            const postDocRef = doc(db, "posts", postId);

            // Update post in Firestore
            await updateDoc(postDocRef, {
                title: updatedTitle,
                description: updatedDescription
            });

            // Update post in local state
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? { ...post, title: updatedTitle, description: updatedDescription }
                        : post
                )
            );

            toast.success("Post updated successfully!");
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("Error updating post.");
        }
    };

    // Delete post both from Firestore and local state
    const deletePost = async (postId) => {
        try {
            const postDocRef = doc(db, "posts", postId);

            // Delete post from Firestore
            await deleteDoc(postDocRef);

            // Remove post from local state
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));

            const userDocRef = doc(db, "users", currentUser.uid);
            await updateDoc(userDocRef, {
                postsCreated: increment(-1)
            });

            toast.success("Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Error deleting post.");
        }
    };


    const updateLike = async (postId) => {

        console.log(postId)
        try {
            const postDocRef = doc(db, "posts", postId); // Reference to the specific post
    
            // Get the current post's data
            const postSnapshot = await getDoc(postDocRef);
            const postData = postSnapshot.data();
            const currentUserId = currentUser.uid;
    
            // Check if the user has already liked the post
            let updatedLikedUsers = [...postData.likedUsers];
    
            if (updatedLikedUsers.includes(currentUserId)) {
                // If the user has already liked the post, remove their ID
                updatedLikedUsers = updatedLikedUsers.filter(userId => userId !== currentUserId);
                toast.info("Post DisLiked!");
            } else {
                // If the user has not liked the post, add their ID
                updatedLikedUsers.push(currentUserId);
                toast.success("Post Liked");
            }
    
            // Update the likes count based on the number of users who liked the post
            const updatedLikes = updatedLikedUsers.length;
    
            // Update Firestore with the new likedUsers and likes count
            await updateDoc(postDocRef, {
                likedUsers: updatedLikedUsers,
                likes: updatedLikes
            });
    
            // Update local state to reflect the changes
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? { ...post, likedUsers: updatedLikedUsers, likes: updatedLikes }
                        : post
                )
            );
        } catch (error) {
            console.error("Error updating like status:", error);
            toast.error("Error updating like status.");
        }
    };
    

    // Fetch posts when the component mounts
    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <PostContext.Provider value={{ posts, createPost, updatePost, deletePost, updateLike, fetchPosts }}>
        {children}
    </PostContext.Provider>
    );
};
