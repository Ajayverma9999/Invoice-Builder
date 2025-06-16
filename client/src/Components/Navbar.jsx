import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import veg2 from '../image/logo-pdf_page-0001.jpg'; 
import { IoHome } from "react-icons/io5"; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isLoggedIn = !!localStorage.getItem('x-auth-token');
  const userRole = localStorage.getItem('slug');

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <nav className="bg-purple-700 fixed w-full z-20 top-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img className="h-[60px]" src={veg2} alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-center gap-6 text-white font-medium flex-1">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/service" className="hover:text-gray-300">Services</Link>
          <Link to="/plans" className="hover:text-gray-300">Plans</Link>
          <Link to="/blog" className="hover:text-gray-300">Blogs</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact</Link>
        </div>

        {/* Right side menu */}
        <div className="hidden md:flex space-x-6 items-center text-white font-medium">
          {!isLoggedIn && (
            <Link to="/login" className="hover:text-gray-300">Sign In</Link>
          )}

          {isLoggedIn && userRole === 'admin' && (
            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          )}

          {isLoggedIn && userRole === 'customer' && (
            <Link to="/user-dasbord" className="hover:text-gray-300">User Dashboard</Link>
          )}

          {isLoggedIn && (
            <button onClick={handleLogout} className="hover:text-gray-300">
              <i className="bi bi-power"></i> Logout
            </button>
          )}

          <p className="hover:text-gray-300">+91 9992356990</p>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden inline-flex items-center p-2 text-white text-xl rounded-lg hover:bg-purple-600"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white text-gray-800 p-4 space-y-4">
          <Link to="/" className="block hover:bg-purple-500 hover:text-white p-2 rounded">Home</Link>
          <Link to="/about" className="block hover:bg-purple-500 hover:text-white p-2 rounded">About</Link>
          <Link to="/service" className="block hover:bg-purple-500 hover:text-white p-2 rounded">Services</Link>
          <Link to="/plans" className="block hover:bg-purple-500 hover:text-white p-2 rounded">Plans</Link>
          <Link to="/blog" className="block hover:bg-purple-500 hover:text-white p-2 rounded">Blogs</Link>
          <Link to="/contact" className="block hover:bg-purple-500 hover:text-white p-2 rounded">Contact</Link>

          {!isLoggedIn && (
            <Link to="/login" className="block hover:bg-purple-500 hover:text-white p-2 rounded">Sign In</Link>
          )}

          {isLoggedIn && userRole === 'admin' && (
            <Link to="/dashboard" className="block hover:bg-purple-500 hover:text-white p-2 rounded">Dashboard</Link>
          )}

          {isLoggedIn && userRole === 'customer' && (
            <Link to="/user-dasbord" className="block hover:bg-purple-500 hover:text-white p-2 rounded">User Dashboard</Link>
          )}

          {isLoggedIn && (
            <button onClick={handleLogout} className="block hover:bg-purple-500 hover:text-white p-2 rounded w-full text-left">
              <i className="bi bi-power"></i> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
