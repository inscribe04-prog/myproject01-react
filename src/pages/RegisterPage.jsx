
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { validateAuthInput, validatePassword } from "../utils";

function RegisterPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!firstname || !lastname || !email || !password) {
        setError('Please fill in all fields');
        return;
    }

    if (/\s/.test(firstname) || /\s/.test(lastname)) {
        setError('First and last name cannot contain spaces');
        return;
    }

    const emailErr = validateAuthInput(email, 'email');
    if (emailErr) { setError(emailErr); return; }

    const passErr = validatePassword(password);
    if (passErr) { setError(passErr); return; }

    const res = await api.register(firstname, lastname, email, password);
    const data = await res.json();
    if (data.success) {
      navigate("/");
    } else {
      setError(data.error);
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    if (name === 'name') {
        if (!/^[A-Za-z]+$/.test(value)) {
            setError('First and last name can only contain letters');
            return;
        } else {
            setError('');
        }
    }

    if (name === 'email') setError(validateAuthInput(value, 'email') || '');
    if (name === 'password') setError(validatePassword(value) || '');
    // if (name === 'name') setError(validateAuthInput(value, 'name') || '');
}



  const inputStyle = {
    width: '100%', padding: '0.6rem 1rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px', color: 'white',
    fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem',
    fontWeight: '600', display: 'block', marginBottom: '0.5rem'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d, #1f1f1f)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '2rem 1rem',
      overflowY: 'auto',
    }}>

      {/* Blobs */}
      <div style={{
        position: 'fixed', width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(220, 220, 220, 0.12)', filter: 'blur(80px)',
        top: '10%', left: '10%', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', width: '250px', height: '250px', borderRadius: '50%',
        background: 'rgba(200, 200, 200, 0.08)', filter: 'blur(80px)',
        bottom: '10%', right: '10%', zIndex: 0
      }} />

      {/* Glass Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '20px',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
        margin: '2rem auto'

      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #ffffff, #c0c0c0)',
            margin: '0 auto 1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem'
          }}>Logo</div>
          <h2 style={{ color: 'white', fontWeight: '700', margin: 0 }}>Create account</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Join MyProject01
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
            color: '#fca5a5', borderRadius: '8px', padding: '0.75rem 1rem',
            marginBottom: '1rem', fontSize: '0.9rem'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} onBlur={handleBlur}>

          <div className="row" style={{ marginBottom: '1rem' }}>
            <div className="col-6">
              <label style={labelStyle}>First Name</label>
              <input type="text" placeholder="John" name="name" value={firstname}
                onChange={(e) => setFirstname(e.target.value)} style={inputStyle} />
            </div>
            <div className="col-6">
              <label style={labelStyle}>Last Name</label>
              <input type="text" placeholder="Doe" name="name" value={lastname}
                onChange={(e) => setLastname(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="you@example.com" name="email" value={email}
              onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="••••••••" name="password" value={password}
              onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </div>

          <button type="submit" style={{
            width: '100%', padding: '0.85rem',
            background: 'linear-gradient(135deg, #ffffff, #d1d5db)',
            border: 'none', borderRadius: '10px',
            color: '#1a1a1a', fontWeight: '700',
            fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255,255,255,0.15)'
          }}>
            Create Account
          </button>
        </form>


        <p style={{ textAlign: 'center', marginTop: '1.5rem',
          color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: '#ffffff', fontWeight: '600', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;