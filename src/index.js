import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Store/FirebaseAuth';
import { PostProvider } from './Store/PostProvider';
import Navbar from './Components/Header/Navbar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    
    <AuthProvider>
    <PostProvider>
      <Navbar />
      <App />
    </PostProvider>
    </AuthProvider>
    
    </BrowserRouter>
  </React.StrictMode>
);
