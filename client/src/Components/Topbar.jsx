import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Userprofile from './User/Userprofile';
import { IoHome } from "react-icons/io5";

export default function Topbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfileSidebar = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header
      className="fixed top-0 left-60 right-0 h-16 bg-white shadow px-6 flex justify-between items-center z-30 border-b"
      style={{ backgroundColor: 'rgb(115, 61, 217)' }}
    >

      <Link to="/">
  <div className="text-lg font-semibold text-white flex items-center space-x-2">
    <IoHome className="w-6 h-6" />
   
  </div>
</Link>


      
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 rounded focus:outline-none text-sm"
        />
        <img
          src="https://i.pravatar.cc/40"
          alt="Avatar"
          className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
          onClick={toggleProfileSidebar}
        />
      </div>

      <Userprofile isOpen={isProfileOpen} onClose={toggleProfileSidebar} />
    </header>
  );
}

