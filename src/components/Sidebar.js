// components/Sidebar.jsx
import React from "react";
import { Nav } from "react-bootstrap";
import logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    toast.success("Logout successfully");
    navigate("/signin");
  };
  return (
    // <div className={`sidebar sticky-top ${collapsed ? 'collapsed' : ''}`}>
    //   <div className="sidebar-header">
    //     <div className={collapsed ? 'd-none' : ''}>
    //     <img src={logo} className='img-fluid' style={{width : "50%"}} alt="logo" />
    //     </div>
    //     <button
    //       className="sidebar-toggle"
    //       onClick={toggleSidebar}
    //     >
    //       <i className='fa-solid fa-list'></i>
    //     </button>
    //   </div>

    //   <div className="sidebar-content">
    //     <Nav className="flex-column">
    //       <Nav.Link className="sidebar-item " onClick={() => navigate("/dashboard")}>
    //         {/* <House size={20} /> */}
    //         <i className='fa-solid fa-home'></i>
    //         <span className={collapsed ? 'd-none' : ''}>Dashboard</span>
    //       </Nav.Link>
    //       <Nav.Link className="sidebar-item" onClick={() => navigate("/investment/decentralized")}>
    //         {/* <People size={20} /> */}
    //         <i class="fa-solid fa-coins"></i>
    //         <span className={collapsed ? 'd-none' : ''}>Invest via wallet</span>
    //       </Nav.Link>
    //       <Nav.Link className="sidebar-item" onClick={() => navigate("/investment/centralized")}>
    //         {/* <People size={20} /> */}
    //         <i class="fa-solid fa-coins"></i>
    //         <span className={collapsed ? 'd-none' : ''}>Invest via Now payment</span>
    //       </Nav.Link>
    //     </Nav>
    //   </div>

    //   <div className="sidebar-footer">
    //     <Nav.Link className="sidebar-item" onClick={handleLogout}>
    //       {/* <BoxArrowRight size={20} /> */}
    //       <i class="fa-solid fa-arrow-right-from-bracket"></i>
    //       <span className={collapsed ? 'd-none' : ''}>Logout</span>
    //     </Nav.Link>
    //   </div>
    // </div>
    <>
      <aside class="col-lg-3 pe-lg-4 pe-xl-5 mt-n3">
        <div class="position-lg-sticky top-0">
          <div class="d-none d-lg-block" style={{paddingTop: "105px"}}></div>
          <div class="offcanvas-lg offcanvas-start" id="sidebarAccount">
            <button
              class="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none"
              type="button"
              data-bs-dismiss="offcanvas"
              data-bs-target="#sidebarAccount"
              aria-label="Close"
            ></button>
            <div class="offcanvas-body">
              <nav class="nav flex-column pb-2 pb-lg-4 mb-3">
                <Link
                  class="nav-link fw-semibold py-2 px-0"
                  to="/dashboard"
                >
                  <i class="fa-solid fa-home fs-5 opacity-60 me-2"></i>
                  Dashboard
                </Link>
                <Link
                  class="nav-link fw-semibold py-2 px-0"
                  to="/investment/decentralized"
                >
                  <i class="fa-solid fa-wallet fs-5 opacity-60 me-2"></i>
                  Invest via wallet
                </Link>
                <Link
                  class="nav-link fw-semibold py-2 px-0"
                  to="/investment/centralized"
                >
                  <i class="fa-solid fa-coins fs-5 opacity-60 me-2"></i>
                  Invest via Now payment
                </Link>
              </nav>
              <nav class="nav flex-column">
                <Link
                  class="nav-link fw-semibold py-2 px-0"
                  onClick={handleLogout}
                  // to="account-signin.html"
                >
                  <i class="fa-solid fa-arrow-right-from-bracket fs-5 opacity-60 me-2"></i>
                  Sign out
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
