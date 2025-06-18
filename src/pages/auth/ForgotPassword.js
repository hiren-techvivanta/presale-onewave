import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailErrMessage, setEmailErrMessage] = useState("");
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedObject = JSON.parse(user);
    const objectArray = [parsedObject];
    if (objectArray[0] !== null) {
      navigate("/presale");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      if (!email) {
        setEmailErrMessage("Email is required");
        return;
      }

      const formData = {
        email,
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/forgetPassword`,
        formData,
        { withCredentials: true }
      );

      if (data.status === true) {
        setloading(false);
        toast.info("Chack your Email to change password");
      }
    } catch (error) {
      setloading(false);
      toast.error(error.response.data.message || "Internal server error");
    }
  };
  return (
    <>
      <div className="blur-bg py-3 px-4 d-flex justify-content-between align-items-center w-100 shadow-sm position-absolute top-0">
        <img
          src={logo}
          alt="Wave Logo"
          className="img-fluid"
          style={{ maxWidth: "120px" }}
        />
        <button
          className="btn btn-primary px-4"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </button>
      </div>

      {/* Background + Centered Form */}
      <div className="login-page position-relative vh-100 mh-100">
        {/* Background Image Overlay */}
        <div className="position-absolute w-100 h-100 bg-dark bg-opacity-10"></div>

        {/* Centered Login Box */}
        <div className="position-absolute translate-centrt w-100 mw-100 px-3">
          <div
            className="login-box shadow-lg rounded-3 bg-white "
            style={{ maxWidth: "450px" }}
          >
            <div className="p-3 pb-0">
              <h2 className="fw-semibold">Forgot Password</h2>
              <p className="text-secondary mb-4">
                Reset your password without any hassle
              </p>
            </div>
            <hr />

            <form className="px-3" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-3">
                <label className="form-label fw-medium">Email</label>
                <input
                  type="email"
                  className={`form-control rounded-2 ${
                    emailErrMessage ? "is-invalid" : ""
                  }`}
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailErrMessage && (
                  <div className="invalid-feedback">{emailErrMessage}</div>
                )}
              </div>

              {/* Sign In Button */}
              {loading === true ? (
                <>
                  <button className="btn btn-primary text-ligh w-100 py-2 rounded-2 fw-medium" disabled>
                    Loading...
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary text-ligh w-100 py-2 rounded-2 fw-medium"
                  >
                    Continue
                  </button>
                </>
              )}

              {/* Sign Up Link */}
              <div className="d-flex gap-3 justify-content-center py-2">
                <p className="text-center mt-2 text-secondary pe-3 border-end">
                  <Link
                    to={"/signin"}
                    className="text-primary text-decoration-none fw-medium"
                  >
                    Sign in{" "}
                  </Link>
                </p>
                <p className="text-center mt-2 text-secondary">
                  {" "}
                  <Link
                    to="/signup"
                    className="text-primary text-decoration-none fw-medium"
                  >
                    {" "}
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
