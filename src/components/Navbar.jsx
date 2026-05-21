import { Link } from "react-router-dom";


function Navbar({ user, onLogout, onHome }) {
  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <Link to="/form" className="navbar-brand" style={{ textDecoration: 'underline',
    textDecorationColor: '#04AA6D',
    textDecorationThickness: '2px',
    textUnderlineOffset: '4px', 
    cursor: 'pointer', color: 'white'}} onClick={onHome} >
      My Project</Link>
      <div className="d-flex align-items-center gap-3">
        {user && (
          <span className="text-white">
            Welcome, {user.firstname} {user.lastname}!
          </span>
        )}

        {user?.isAdmin && (
          <Link to="/admin" className="btn btn-outline-warning btn-sm">
            Admin Panel
           </Link>
        )}

        <button className="btn btn-outline-light btn-sm" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}


export default Navbar;