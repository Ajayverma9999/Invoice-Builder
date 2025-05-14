import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Topbar from '../Components/Topbar';
import { Link } from 'react-router-dom';

const Invoicelist = () => {
  const [invoices] = useState([
    { id: 1, customer: 'John Doe', amount: '$250', date: '2025-04-10', status: 'Paid' },
    { id: 2, customer: 'Jane Smith', amount: '$180', date: '2025-04-08', status: 'Pending' },
    { id: 3, customer: 'Bob Johnson', amount: '$300', date: '2025-04-01', status: 'Overdue' },
  ]);

  const renderStatusBadge = (status) => {
    let color = 'bg-gray-400';
    if (status === 'Paid') color = 'bg-green-500';
    else if (status === 'Pending') color = 'bg-yellow-500';
    else if (status === 'Overdue') color = 'bg-red-500';

    return (
      <span className={`px-3 py-1 text-white text-sm rounded-md ${color}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <Sidebar />
      <Topbar />
      <div className="ml-60 mt-16 p-6 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Invoice List</h2>
          <Link to="/addinvoice">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
              Add New Invoice
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3 border-b">#</th>
                <th className="text-left px-6 py-3 border-b">Customer</th>
                <th className="text-left px-6 py-3 border-b">Amount</th>
                <th className="text-left px-6 py-3 border-b">Date</th>
                <th className="text-left px-6 py-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{invoice.id}</td>
                  <td className="px-6 py-4 border-b">{invoice.customer}</td>
                  <td className="px-6 py-4 border-b">{invoice.amount}</td>
                  <td className="px-6 py-4 border-b">{invoice.date}</td>
                  <td className="px-6 py-4 border-b">
                    {renderStatusBadge(invoice.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoicelist;
