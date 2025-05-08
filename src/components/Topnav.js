import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo-white.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAccount, useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

const Topnav = () => {
  const navigate = useNavigate();

  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
    const { open, close } = useAppKit();

  const [user, setuser] = useState([]);
  const [showDisconnect, setshowDisconnect] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setshowDisconnect(true);
    } else {
      setshowDisconnect(false);
    }

    if (address) {
    }
  }, [isConnected, address]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedObject = JSON.parse(user);
    const objectArray = [parsedObject];
    setuser(objectArray[0]);
    if (objectArray[0] === null) {
      navigate("/signin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logout Successfull");
    navigate("/");
  };

  return (
    <>
      <nav class="navbar navbar-expand-lg blur-bg-2">
        <div class="container position-relative z-2">
          <div onClick={() => navigate("/dashboard")}>
            <img
              onClick={() => navigate("/")}
              src={logo}
              alt="Wave Logo"
              style={{ maxWidth: "120px" }}
              className="img-fluid"
            />
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
           
            <li class="nav-item px-2">
          <Link class="nav-link nav-text" to="/dashboard">Dashboard</Link>
        </li>
        <li class="nav-item px-2">
          <Link class="nav-link nav-text" to="/presale">Presele</Link>
        </li>
        
            </ul>
            <div className="ms-auto d-flex">
              <p className="fw-bold text-white my-2 me-3">
                {address && <i className="fa-solid fa-wallet me-2"></i>}{address && `${address.slice(0, 4)}***${address.slice(-4)}`}
              </p>

              {showDisconnect && (
                <button
                  class="rounded-2 custom-login px-4 py-2 me-3"
                  onClick={disconnect}
                >
                  Disconnect Wallet
                </button>
              )} 
              {!showDisconnect && (
                <button
                  class="rounded-2 custom-login px-4 py-2 me-3"
                  onClick={open}
                >
                  Connect Wallet
                </button>
              )}

              <button
                class="rounded-2 custom-login px-4 py-2"
                type="submit"
                onClick={() =>
                  user === null ? navigate("/signin") : handleLogout()
                }
              >
                {user === null ? "Login" : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Topnav;
