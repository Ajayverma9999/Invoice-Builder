import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
 const navigate = useNavigate();



  const isLoggedIn = !!localStorage.getItem('x-auth-token');
  const userRole = localStorage.getItem('slug');

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };
  return (
    
    <div
    className="w-60 h-screen text-white shadow-md fixed top-0 left-0 z-40"
    style={{ backgroundColor: 'rgb(115, 61, 217)' }}
  >
     <Link to="/user-dashboard">
    <div className="p-6 text-xl font-bold border-b border-blue-400">
      Dashboard
    </div>
    </Link>
    <nav className="p-4 space-y-2">

    {/* {userRole === 'admin' && ( */}
       <Link to="/userlist" className="block py-2 px-4 rounded hover:bg-red-500 transition">
       Users
     </Link>
        {/* )} */}
        {/* {userRole === 'customer' && ( */}
      <Link to="/invoice-list" className="block py-2 px-4 rounded hover:bg-red-500 transition">
        Invoice
      </Link>
           {/* )} */}
            {/* {userRole === 'customer' && ( */}
      <Link to="/analytics" className="block py-2 px-4 rounded hover:bg-red-500 transition">
        Template
      </Link>
      {/* )} */}
    </nav>
  </div>
  );
}

