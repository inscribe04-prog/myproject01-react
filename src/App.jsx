import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FormPage from "./pages/FormPage";
import AdminPage from "./pages/AdminPage";
import api from "./api";
import NotFoundPage from "./pages/NotFoundPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState(null);

  useEffect(() => {
    api.getCurrentUser()
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (

    <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d, #1f1f1f)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div className="spinner-border" style={{ color: 'white', width: '3rem', height: '3rem' }} role="status" />
    <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Loading...</p>
  </div>

  );

  return (

    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/form" /> : <LoginPage onLogin={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/form" element={user ? <FormPage user={user} setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/admin" element={user?.isAdmin ? <AdminPage user={user} setUser={setUser} adminUsers={adminUsers} setAdminUsers={setAdminUsers} /> : <Navigate to="/form" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;