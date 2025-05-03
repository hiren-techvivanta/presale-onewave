import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
      setSidebarCollapsed(!sidebarCollapsed);
    };
  return (
    <>
         <div className="admin-layout">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="content-header">
          <Button 
            variant="light" 
            className="d-md-none me-2" 
            onClick={toggleSidebar}
          >
          <i className='fa-solid fa-list'></i>
            {/* <List size={20} /> */}
          </Button>
          <h2></h2>
        </div>
        
        <div className="content-body">
          
        </div>
      </div>
    </div>
    </>
  )
}

export default Dashboard