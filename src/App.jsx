import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import ProtectedRoute from './Components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import Myposts from './Pages/MyPosts/Myposts';

const Home = lazy(() => import('./Pages/Home/Home'));
const Profile = lazy(() => import('./Pages/Profile/Profile'));
const Dashboard = lazy(() => import('./Pages/SuperAdminDasboard/SuperAdminDashboard'));
const Signup = lazy(() => import('./Pages/Signup/Signup'));
const Login = lazy(() => import('./Pages/Login/Login'));

const loaderStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
};

const App = () => {


  return (
    <>
      <div>
        <Suspense fallback={<div style={loaderStyles}><GridLoader color="#c41bd5" size={50} /></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/myPosts" element={<ProtectedRoute><Myposts /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
