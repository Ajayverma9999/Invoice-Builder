import React, { Component } from 'react';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';
import Userdashbord from '../User/Userdashbord';

class Dashboard extends Component {
    render() {
        return (
           <div className="flex h-screen bg-gray-100 font-sans">
                       <Sidebar/>
                       <div className="flex-1 flex flex-col">
                         <Topbar/>
                         <Userdashbord/>
                       </div>
                     </div>
        );
    }
}

export default Dashboard;