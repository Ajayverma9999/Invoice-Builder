import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Userprofile = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'User',
    avatar: 'https://i.pravatar.cc/100',
    invoiceType: [],
    prefix: '',
    caunter: '',
    invoicePattern: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedDateFormats, setSelectedDateFormats] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({
        ...user,
        avatar: URL.createObjectURL(file),
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleSave = () => {
    console.log('User profile updated:', user);
    setIsEditing(false);
  };

  const dateFormatsMap = {
    daily: [
      'DD/MM/YYYY',
      'MM/DD/YYYY',
      'YYYY/MM/DD',
      'YYYY-DD-MM',
      'DD-MM-YYYY',
      'MM-DD-YYYY',
    ],
    monthly: [
      'MM/YYYY',
      'YYYY/MM',
      'MM-YYYY',
      'YYYY-MM',
      'MMMM YYYY',
      'YYYY MMMM',
    ],
    yearly: [
      'YYYY/DD/MM',
      'MM/DD',
      'YYYY',
      'YY',
      'YYYY-MM',
      'YYYY/MM',
    ],
  };

  const selectedFormats = user.invoiceType.reduce((formats, type) => {
    if (dateFormatsMap[type]) {
      formats.push(...dateFormatsMap[type]);
    }
    return formats;
  }, []);

  useEffect(() => {
    setSelectedDateFormats(selectedFormats);
  }, [user.invoiceType]);

  const generateInvoicePattern = () => {
    const { prefix, caunter } = user;
    const p = prefix || 'prefix';
    const c = caunter || 'caunter';
    const patterns = [];

    if (selectedDateFormats.length === 0) return [];

    selectedDateFormats.forEach((format) => {
      patterns.push(`${p}/${format}/${c}`);
      patterns.push(`${format}/${p}/${c}`);
      patterns.push(`${c}/${format}/${p}`);
      patterns.push(`${p}/${c}/${format}`);
      patterns.push(`${format}/${c}/${p}`);
      patterns.push(`${c}/${p}/${format}`);
      patterns.push(`${p}-${format}-${c}`);
      patterns.push(`${format}-${p}-${c}`);
      patterns.push(`${c}-${p}-${format}`);
      patterns.push(`${p}_${format}-${c}`);
      patterns.push(`${format}_${p}-${c}`);
      patterns.push(`${c}-${format}_${p}`);
    });

    return [...new Set(patterns)];
  };

  const invoicePatternOptions = generateInvoicePattern();

  return (

    <div
      className={`fixed ml-60  top-0 left-0 w-full h-full bg-white shadow-lg z-50 transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      style={{ transition: 'transform 0.3s ease-in-out' }}
    >

      <button
        onClick={onClose}
        className="absolute top-4 left-4 text-red-500 text-2xl"
      >
        ✖
      </button>


      <div className="p-6 max-w-4xl mx-auto mt-16 overflow-y-auto h-[80vh]">


        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-400 mt-1">{user.role}</p>
          </div>
        </div>


        {isEditing ? (
          <>
            <div className="flex flex-wrap gap-4">

              <div className="w-full md:w-[48%]">
                <label className="block text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>


              <div className="w-full md:w-[48%]">
                <label className="block text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>


              <div className="w-full md:w-[48%]">
                <label className="block text-sm">Avatar</label>
                <input
                  type="file"
                  onChange={handleAvatarChange}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>


              <div className="w-full md:w-[48%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prefix
                </label>
                <input
                  type="text"
                  name="prefix"
                  value={user.prefix}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>


              <div className="w-full md:w-[48%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caunter
                </label>
                <input
                  type="text"
                  name="caunter"
                  value={user.caunter}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>


              <div className="w-full md:w-[48%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Type
                </label>
                <select
                  name="invoiceType"
                  multiple
                  value={user.invoiceType}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(
                      (option) => option.value
                    );
                    setUser({ ...user, invoiceType: selected });
                  }}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>


              {selectedFormats.length > 0 && (
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Choose Date Formats for Invoice Pattern
                  </label>
                  <select
                    multiple
                    value={selectedDateFormats}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(
                        (option) => option.value
                      );
                      setSelectedDateFormats(selected);
                    }}
                    className="w-full p-2 border rounded text-sm"
                  >
                    {selectedFormats.map((format, index) => (
                      <option key={index} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>
              )}


              <div className="w-full md:w-[48%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Pattern
                </label>
                <select
                  name="invoicePattern"
                  value={user.invoicePattern}
                  onChange={handleChange}
                  className="w-full p-1 border rounded text-sm"
                >
                  <option value="">Select Pattern</option>
                  {invoicePatternOptions.map((pattern, index) => (
                    <option key={index} value={pattern}>
                      {pattern}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <div className="mt-6 space-x-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <button
              onClick={() => {
                setIsEditing(true);

              }}

              className=" px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Edit Profile
            </button>
          </div>
        )}


        <button
          onClick={handleLogout}
          className=" px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition mt-4"
        >
          Logout
        </button>
      </div>
    </div>

  );
};

export default Userprofile;
