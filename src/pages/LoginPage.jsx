import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateAuthInput } from "../utils";
import api from "../api";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const emailErr = validateAuthInput(email, 'email');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (emailErr) { setError(emailErr); return; }

    const res = await api.login(email, password);
    const data = await res.json();

    if (data.success) {
      const user = await api.getCurrentUser();
      onLogin(user);
      navigate("/form");
    } else {
      setError(data.error);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4">
            <h3 className="mb-3">Login</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            <p className="mt-3 text-center">
              No account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;