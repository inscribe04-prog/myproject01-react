function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <span className="navbar-brand">MyProject</span>
      <div className="d-flex align-items-center gap-3">
        {user && (
          <span className="text-white">
            Welcome, {user.firstname} {user.lastname}!
          </span>
        )}
        <button className="btn btn-outline-light btn-sm" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;