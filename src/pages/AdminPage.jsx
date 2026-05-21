import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

function AdminPage({ user, setUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function handleLogout() {
    await api.logout();
    setUser(null);
    navigate("/");
  }

  async function loadUsers() {
    const res = await fetch('/admin/users', { credentials: 'include' });
    if (!res.ok) return;
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return;
    await fetch(`/admin/users/${id}`, { method: 'DELETE', credentials: 'include' });
    await loadUsers();
  }

  async function toggleAdmin(id, current) {
    await fetch(`/admin/users/${id}/admin`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAdmin: !current }),
      credentials: 'include'
    });
    await loadUsers();
  }

  useEffect(() => { loadUsers(); }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container py-4">
        <h3>Admin Panel</h3>
        <p className="text-muted">Manage registered users</p>

        {loading ? (
          <div className="spinner-border text-primary" role="status" />
        ) : (
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
                {users.map((u) => (
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
        )}
      </div>
    </div>
  );
}

export default AdminPage;
