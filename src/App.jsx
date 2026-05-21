
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FormPage from "./pages/FormPage";
import AdminPage from "./pages/AdminPage";
import api from "./api";

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

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/form" /> : <LoginPage onLogin={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/form" element={user ? <FormPage user={user} setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/admin" element={user?.isAdmin ? <AdminPage user={user} setUser={setUser} adminUsers={adminUsers} setAdminUsers={setAdminUsers} /> : <Navigate to="/form" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;