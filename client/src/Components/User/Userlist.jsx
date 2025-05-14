import React, { Component } from 'react';
import Sidebar from '../Sidebar';  
import Topbar from '../Topbar';    
import { Link } from 'react-router-dom';
import Userprofile from './Userprofile';

class Userlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: [
        { id: 1, customer: 'John Doe', amount: '280', startdate: '2025-02-01', enddate: '2025-02-28', days: '28', status: 'Unactive' },
        { id: 2, customer: 'Jane Smith', amount: '600', startdate: '2025-04-01', enddate: '2025-06-01', days: '60', status: 'Active' },
        { id: 3, customer: 'Bob Johnson', amount: '300', startdate: '2025-04-01', enddate: '2025-05-01', days: '30', status: 'Active' },
      ],
    };
  }

  renderStatusBadge = (status) => {
    let color = 'bg-gray-400';
    if (status === 'Active') color = 'bg-green-500';
    else if (status === 'Unactive') color = 'bg-red-500';

    return (
      <span className={`px-3 py-1 text-white text-sm rounded-md ${color}`}>
        {status}
      </span>
    );
  };

  render() {
    const { user } = this.state;

    return (
      <div>
        <Sidebar />
        <Topbar />
        <div className="ml-60 mt-16 p-6 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">User List</h2>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 border-b">Sr.No</th>
                  <th className="text-left px-6 py-3 border-b">User</th>
                  <th className="text-left px-6 py-3 border-b">Amount</th>
                  <th className="text-left px-6 py-3 border-b">Start Date</th>
                  <th className="text-left px-6 py-3 border-b">End Date</th>
                  <th className="text-left px-6 py-3 border-b">Days</th>
                  <th className="text-left px-6 py-3 border-b">Status</th>
                  <th className="text-left px-6 py-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {user.map((userData) => (
                  <tr key={userData.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{userData.id}</td>
                    <td className="px-6 py-4 border-b">{userData.customer}</td>
                    <td className="px-6 py-4 border-b">{userData.amount}</td>
                    <td className="px-6 py-4 border-b">{userData.startdate}</td>
                    <td className="px-6 py-4 border-b">{userData.enddate}</td>
                    <td className="px-6 py-4 border-b">{userData.days}</td>
                    <td className="px-6 py-4 border-b">
                      {this.renderStatusBadge(userData.status)}
                    </td>
                    <td className="px-6 py-4 border-b">
                        <Userprofile/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Userlist;


