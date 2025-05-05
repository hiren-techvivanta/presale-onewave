import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo-white.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAccount, useDisconnect } from "wagmi";

const Topnav = () => {
  const navigate = useNavigate();

  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

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
            {/* <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown px-2">
                <a
                  class="nav-link dropdown-toggle nav-text"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Utilities
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item dropdown px-2">
                <a
                  class="nav-link dropdown-toggle nav-text"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Resources
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item px-2">
          <a class="nav-link nav-text" href="#">Lern</a>
        </li>
        <li class="nav-item px-2">
          <Link class="nav-link nav-text" to="/presale">Presele</Link>
        </li>
        <li class="nav-item px-2">
          <a class="nav-link nav-text" href="#">Staking</a>
        </li>
        <li class="nav-item px-2">
          <a class="nav-link nav-text" href="#">Roadmap</a>
        </li>
        <li class="nav-item px-2">
          <a class="nav-link nav-text" href="#">Tokenomics</a>
        </li>
        <li class="nav-item px-2">
          <a class="nav-link nav-text" href="#">Team</a>
        </li>
        <li class="nav-item px-2">
          <a class="nav-link nav-text" href="#">Downloads</a>
        </li>
        <li class="nav-item px-2">
          <a class="nav-link nav-text" href="#">Contact</a>
        </li>
            </ul> */}
            <div className="ms-auto d-flex">
              <p className="fw-bold text-white my-2 me-3">
                {user && `Welcome, ${user?.firstName} ${user?.lastName}`}{" "}
                {address && `${address.slice(0, 6)}*****${address.slice(-5)}`}
              </p>

              {showDisconnect && (
                <button
                  class="rounded-2 custom-login px-4 py-2 me-3"
                  onClick={disconnect}
                >
                  Disconnect Wallet
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
