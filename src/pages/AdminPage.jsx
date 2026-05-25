import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";
import DashboardStats from '../components/DashboardStats'; 


function AdminPage({ user, setUser, adminUsers, setAdminUsers }) {
  const navigate = useNavigate();

  async function loadUsers() {
    const res = await fetch('/admin/users', { credentials: 'include' });
    if (!res.ok) return;
    const data = await res.json();
    setAdminUsers(data);
  }

  useEffect(() => {
    if (!adminUsers) loadUsers();
  }, []);

  async function handleLogout() {
    await api.logout();
    setUser(null);
    navigate("/");
  }

  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return;
    await fetch(`/admin/users/${id}`, { method: 'DELETE', credentials: 'include' });
    await loadUsers();
  }

  async function toggleAdmin(id, current) {

    const action = current ? 'Remove Admin' : 'Make Admin';
    if (!window.confirm(`Are you sure you want to ${action} for this user?`)) return;
    
    await fetch(`/admin/users/${id}/admin`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAdmin: !current }),
      credentials: 'include'
    });
    await loadUsers();
  }

  if (!adminUsers) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar user={user} onLogout={handleLogout} onHome={() => navigate('/form')} />
      <div className="container py-4">
        <div className="spinner-border text-primary" role="status" />
      </div>
    </div>
  );

  return (

    // <div className="container mt-4">
    //         <h1>Administrative Dashboard</h1>
    // {
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar user={user} onLogout={handleLogout} onHome={() => navigate('/form')} />

        <div className="container py-4">
        <h2 className="mb-4">Administrative Dashboard</h2>

        {/* ADDED: The new stats component */}
        <DashboardStats />


      <div className="user-management-section mt-4 bg-white p-4 shadow-sm rounded">
          <h3>User Management</h3>
        <p className="text-muted">Manageaasd registered users</p>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.firstname}</td>
                  <td>{u.lastname}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.isAdmin ? 'bg-success' : 'bg-secondary'}`}>
                      {u.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => toggleAdmin(u.id, u.isAdmin)}
                      disabled={u.id === user?.id}
                    >
                      {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(u.id)}
                      disabled={u.id === user?.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
}

export default AdminPage;