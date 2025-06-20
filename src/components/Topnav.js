import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
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

  // const handleDisconnectWallet = () => {
  //   disconnect();
  //   window.location.reload();
  // };

  const handleDisconnectWallet = () => {
    disconnect();

    // Safari-specific storage clearing
    const clearStorage = () => {
      try {
        // Clear wagmi-related storage keys
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("wagmi.") || key.startsWith("wc@2")) {
            localStorage.removeItem(key);
          }
        });

        // Clear sessionStorage if used
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith("wagmi.")) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.error("Storage clearing error:", e);
      }
    };

    clearStorage();

    // Force full page reload
    window.location.href = "/";
    window.location.reload();
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg blur-bg-2"
        style={{ borderBottom: "none" }}
      >
        <div className="container position-relative z-2">
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
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item px-2">
                <Link className="nav-link nav-text" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item px-2">
                <Link className="nav-link nav-text" to="/presale">
                  Presale
                </Link>
              </li>
              <li className="nav-item px-2 d-md-none">
                <p className="fw-bold my-2 me-3">
                  {address && <i className="fa-solid fa-wallet me-2"></i>}
                  {address && `${address.slice(0, 4)}***${address.slice(-4)}`}
                </p>
              </li>
            </ul>
            <div className="ms-md-auto d-flex mb-2 mx-2">
              <p className="fw-bold my-2 me-3 d-none d-md-block">
                {address && <i className="fa-solid fa-wallet me-2"></i>}
                {address && `${address.slice(0, 4)}***${address.slice(-4)}`}
              </p>

              {showDisconnect && (
                <button
                  className="rounded-2 btn btn-primary px-4 py-2 me-3"
                  onClick={handleDisconnectWallet}
                >
                  Disconnect Wallet
                </button>
              )}
              {!showDisconnect && (
                <button
                  className="rounded-2 btn btn-primary px-4 py-2 me-3"
                  onClick={open}
                >
                  Connect Wallet
                </button>
              )}

              <button
                className="rounded-2 btn btn-primary px-4 py-2"
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
