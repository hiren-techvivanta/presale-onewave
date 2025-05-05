// components/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import logo from '../assets/images/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



const Sidebar = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate()

  const handleLogout = (e) => { 
    e.preventDefault()
    localStorage.removeItem("user")
    toast.success("Logout successfully")
    navigate("/signin")
   }
  return (
    <div className={`sidebar sticky-top ${collapsed ? 'collapsed' : ''}`}>
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
          <Nav.Link className="sidebar-item " onClick={() => navigate("/dashboard")}>
            {/* <House size={20} /> */}
            <i className='fa-solid fa-home'></i>
            <span className={collapsed ? 'd-none' : ''}>Dashboard</span>
          </Nav.Link>
          <Nav.Link className="sidebar-item" onClick={() => navigate("/investment/decentralized")}>
            {/* <People size={20} /> */}
            <i class="fa-solid fa-coins"></i>
            <span className={collapsed ? 'd-none' : ''}>Invest via wallet</span>
          </Nav.Link>
          <Nav.Link className="sidebar-item" onClick={() => navigate("/investment/centralized")}>
            {/* <People size={20} /> */}
            <i class="fa-solid fa-coins"></i>
            <span className={collapsed ? 'd-none' : ''}>Invest via Now payment</span>
          </Nav.Link>
        </Nav>
      </div>

      <div className="sidebar-footer">
        <Nav.Link className="sidebar-item" onClick={handleLogout}>
          {/* <BoxArrowRight size={20} /> */}
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          <span className={collapsed ? 'd-none' : ''}>Logout</span>
        </Nav.Link>
      </div>
    </div>
  );
};

export default Sidebar;