import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Userdashbord() {
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
    <main className="p-6 flex-1 ml-60 mt-16 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


        {userRole === 'admin' && (
          <div className="bg-white p-4 rounded-md shadow-md border border-gray-800">
            <h2 className="text-lg font-semibold text-gray-700">Users</h2>
            <p className="text-2xl font-bold mt-2 text-gray-900">1,200</p>
          </div>
        )}
        {userRole === 'customer' && (
          <div className="bg-white p-4 rounded-md shadow-md border border-gray-800">
            <h2 className="text-lg font-semibold text-gray-700">Invoice</h2>
            <p className="text-2xl font-bold mt-2 text-gray-900">1,200</p>
          </div>
        )}


        <div className="bg-white p-4 rounded-md shadow-md border border-gray-800">
          <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
          <p className="text-2xl font-bold mt-2 text-gray-900">$34,000</p>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md border border-gray-800">
          <h2 className="text-lg font-semibold text-gray-700">New Signups</h2>
          <p className="text-2xl font-bold mt-2 text-gray-900">320</p>
        </div>
      </div>
    </main>
  );
}



