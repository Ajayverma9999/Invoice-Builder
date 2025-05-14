import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import veg2 from '../image/images__1_-removebg-preview.png';
import { IoHome } from "react-icons/io5"; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isLoggedIn = !!localStorage.getItem('x-auth-token');
  const userRole = localStorage.getItem('slug');

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <nav className="bg-purple-700 fixed w-full z-20 top-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img className="h-[60px]" src={veg2} alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/about" className="text-white hover:text-gray-300">About</Link>
          <Link to="/contact" className="text-white hover:text-gray-300">Contact</Link>

          {!isLoggedIn && (
            <>
              <Link to="/login" className="text-white hover:text-gray-300 ">Sign In</Link>
              {/* <Link to="/register" className="text-white hover:text-gray-300">Sign Up</Link> */}
            </>
          )}
          <Link to="/" className="text-white hover:text-gray-300"><IoHome className="w-6 h-6"/></Link>

          {isLoggedIn && userRole === 'admin' && (
            <Link to="/dashboard" className="text-white hover:text-gray-300">Dashboard</Link>
          )}

          {isLoggedIn && userRole === 'customer' && (
            <Link to="/user-dasbord" className="text-white hover:text-gray-300">User Dashboard</Link>
          )}

          {isLoggedIn && (
            <button onClick={handleLogout} className="text-white hover:text-gray-300">
              <i className="bi bi-power"></i> Logout
            </button>
          )}
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
        <div className="md:hidden bg-gray-50 dark:bg-gray-800 p-4">
          <ul className="space-y-4">
            <li><Link to="/" className="block text-gray-800 hover:bg-purple-500 p-2 rounded">Home</Link></li>
            <li><Link to="/about" className="block text-gray-800 hover:bg-purple-500 p-2 rounded">About</Link></li>
            <li><Link to="/contact" className="block text-gray-800 hover:bg-purple-500 p-2 rounded">Contact</Link></li>

            {!isLoggedIn && (
              <>
                <li><Link to="/login" className="block text-gray-800 hover:bg-purple-500 p-2 rounded">Sign In</Link></li>
                {/* <li><Link to="/register" className="block text-gray-800 hover:bg-purple-500 p-2 rounded">Sign Up</Link></li> */}
              </>
            )}

            {isLoggedIn && userRole === 'admin' && (
              <li><Link to="/dashboard" className="block text-gray-800 hover:bg-purple-500 p-2 rounded">Dashboard</Link></li>
            )}

            {isLoggedIn && userRole === 'customer' && (
              <>
             <Link to="/user-dasbord" className="text-white hover:text-gray-300">User Dashboard</Link>
              </>
            )}

            {isLoggedIn && (
              <li>
                <button onClick={handleLogout} className="block text-gray-800 hover:bg-purple-500 p-2 rounded">
                  <i className="bi bi-power"></i> Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
