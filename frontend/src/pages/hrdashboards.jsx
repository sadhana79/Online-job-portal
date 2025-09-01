import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav
      className={`navbar navbar-expand-lg px-3 shadow-sm ${
        isLoggedIn ? "navbar-light bg-white" : "navbar-dark"
      }`}
      style={{ backgroundColor: isLoggedIn ? "white" : "#2c3e50" }}
    >
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            src="/logo.jpg"
            alt="logo"
            width="50"
            height="50"
            className="rounded-circle shadow-sm"
          />
          <span className={isLoggedIn ? "text-dark fw-bold" : "text-white fw-bold"}>
            Job Portal
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* Show Home / About / Contact only when not logged in */}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/contact">Contact</Link>
                </li>
              </>
            )}

            {/* Show role after login */}
            {isLoggedIn && role === "user" && (
              <li className="nav-item">
                <Link className="nav-link text-dark fw-bold" to="/user">
                  👤 User Dashboard
                </Link>
              </li>
            )}
            {isLoggedIn && role === "hr" && (
              <li className="nav-item">
                <Link className="nav-link text-dark fw-bold" to="/hr">
                  🧑‍💼 HR Dashboard
                </Link>
              </li>
            )}
            {isLoggedIn && role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link text-dark fw-bold" to="/admin">
                  🛠️ Admin Dashboard
                </Link>
              </li>
            )}

            {/* Login / Logout */}
            {!isLoggedIn ? (
              <li className="nav-item ms-3">
                <Link className="btn btn-warning fw-bold" to="/login">Login</Link>
              </li>
            ) : (
              <li className="nav-item ms-3">
                <button className="btn btn-danger fw-bold" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
