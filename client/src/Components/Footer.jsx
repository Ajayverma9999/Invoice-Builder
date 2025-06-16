import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-6 md:flex md:justify-between md:items-start space-y-6 md:space-y-0">

        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Invoce</h2>
          <p className="text-gray-400 max-w-sm">
            Smart invoicing solution built for small businesses & freelancers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-gray-400">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Features</a></li>
            <li><a href="#" className="hover:text-white">Pricing</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p className="text-gray-400">Email: Invoice@builder.com</p>
          <p className="text-gray-400">Phone: +91 9992356990</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Invoce. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
