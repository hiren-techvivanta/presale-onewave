// components/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import logo from '../assets/images/logo.png'



const Sidebar = ({ collapsed, toggleSidebar }) => {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className={collapsed ? 'd-none' : ''}>
        <img src={logo} className='img-fluid' style={{width : "50%"}} alt="logo" />
        </div>
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
        >
          <i className='fa-solid fa-list'></i>
        </button>
      </div>

      <div className="sidebar-content">
        <Nav className="flex-column">
          <Nav.Link className="sidebar-item active">
            {/* <House size={20} /> */}
            <i className='fa-solid fa-home'></i>
            <span className={collapsed ? 'd-none' : ''}>Dashboard</span>
          </Nav.Link>
          <Nav.Link className="sidebar-item">
            {/* <People size={20} /> */}
            <i className='fa-solid fa-user'></i>
            <span className={collapsed ? 'd-none' : ''}>Users</span>
          </Nav.Link>
        </Nav>
      </div>

      <div className="sidebar-footer">
        <Nav.Link className="sidebar-item">
          {/* <BoxArrowRight size={20} /> */}
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          <span className={collapsed ? 'd-none' : ''}>Logout</span>
        </Nav.Link>
      </div>
    </div>
  );
};

export default Sidebar;