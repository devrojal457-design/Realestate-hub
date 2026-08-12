import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          RealEstate<span className="text-gray-800">Hub</span>
        </Link>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className="hidden md:flex items-center gap-5">
          <Link to="/properties" className="text-gray-700 hover:text-primary">
            Browse Properties
          </Link>
          {user && (
            <Link to="/favorites" className="text-gray-700 hover:text-primary">
              Favorites
            </Link>
          )}
          {user && user.role === "owner" && (
            <>
              <Link to="/add-property" className="text-gray-700 hover:text-primary">
                Add Property
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-primary">
                Dashboard
              </Link>
            </>
          )}
          {user && (
            <Link to="/inquiries" className="text-gray-700 hover:text-primary">
              Inquiries
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="btn-outline">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-4 pb-4">
          <Link to="/properties" onClick={() => setMenuOpen(false)}>
            Browse Properties
          </Link>
          {user && (
            <Link to="/favorites" onClick={() => setMenuOpen(false)}>
              Favorites
            </Link>
          )}
          {user && user.role === "owner" && (
            <>
              <Link to="/add-property" onClick={() => setMenuOpen(false)}>
                Add Property
              </Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            </>
          )}
          {user && (
            <Link to="/inquiries" onClick={() => setMenuOpen(false)}>
              Inquiries
            </Link>
          )}
          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-left">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
