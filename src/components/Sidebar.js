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
    <>
      <aside className="col-lg-3 pe-lg-4 pe-xl-5 ps-lg-4 ps-xl-5 mt-n3 pt-4 shadow bg-white rounded-5">
        <div className="position-lg-sticky top-0">
          {/* <div className="d-none d-lg-block" style={{paddingTop: "105px"}}></div> */}
          <div className="py-4">
            <img src={logo} className="img-fluid w-50" alt="" />
          </div>
          <div className="offcanvas-lg offcanvas-start" id="sidebarAccount">
            <button
              className="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none"
              type="button"
              data-bs-dismiss="offcanvas"
              data-bs-target="#sidebarAccount"
              aria-label="Close"
            ></button>
            <div className="offcanvas-body">
              <nav className="nav flex-column pb-2 pb-lg-4 mb-3">
                <Link
                  className="nav-link fw-semibold py-2 px-0"
                  to="/dashboard"
                >
                  <i className="fa-solid fa-home fs-5 opacity-60 me-3"></i>
                  Dashboard
                </Link>
                <Link
                  className="nav-link fw-semibold py-2 px-0"
                  to="/investment/decentralized"
                >
                  <i className="fa-solid fa-wallet fs-5 opacity-60 me-3"></i>
                  Invest via wallet
                </Link>
                <Link
                  className="nav-link fw-semibold py-2 px-0"
                  to="/investment/centralized"
                >
                  <i className="fa-solid fa-coins fs-5 opacity-60 me-3"></i>
                  Invest via Now payment
                </Link>
              </nav>
              <nav className="nav flex-column">
                <Link
                  className="nav-link fw-semibold py-2 px-0"
                  onClick={handleLogout}
                  // to="account-signin.html"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket fs-5 opacity-60 me-3"></i>
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
