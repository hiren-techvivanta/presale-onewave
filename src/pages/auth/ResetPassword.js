import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import mainbg from "../../assets/images/login-slider.png";
import logo from "../../assets/images/logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordErrMessage, setPasswordErrMessage] = useState("");
  const [confirmPasswordErrMessage, setConfirmPasswordErrMessage] = useState("");

  const [loading, setloading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/presale");
    }
  }, [navigate]);

  const validateForm = () => {
    let isValid = true;
    setPasswordErrMessage("");
    setConfirmPasswordErrMessage("");

    if (!password.trim()) {
      setPasswordErrMessage("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordErrMessage("Password must be at least 8 characters long");
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordErrMessage("Confirm password is required");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordErrMessage("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setloading(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/resetPassword`,
        { newPassword: password, token },
        { withCredentials: true }
      );

      if (response.data.status === true) {
        setloading(false);
        toast.success(response.data.message);
        navigate("/signin");
      }
    } catch (error) {
      setloading(false);
      toast.error(error.response?.data?.message || "Internal server error");
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="blur-bg py-3 px-4 d-flex justify-content-between align-items-center w-100 shadow-sm position-absolute top-0">
        <img
          src={logo}
          alt="Logo"
          className="img-fluid"
          style={{ maxWidth: "120px" }}
        />
        <button
          className="btn btn-primary px-4"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>

      {/* Background & Form */}
      <div className="login-page position-relative vh-100 mh-100">
        <div className="position-absolute w-100 h-100 bg-dark bg-opacity-10"></div>

        <div className="position-absolute translate-centrt w-100 mw-100 px-3">
          <div
            className="login-box shadow-lg rounded-3 bg-white"
            style={{ maxWidth: "450px" }}
          >
            <div className="p-3 pb-0">
              <h2 className="fw-semibold">Reset Password</h2>
              <p className="text-secondary mb-4">
                Fill new password and confirm to reset your account password
              </p>
            </div>
            <hr />

            <form className="px-3" onSubmit={handleReset}>
              {/* New Password */}
              <div className="mb-3 position-relative">
                <label className="form-label fw-medium">New Password</label>
                <div className="position-relative">
                  <input
                    className={`form-control rounded-2 ${
                      passwordErrMessage ? "is-invalid" : ""
                    }`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label className="password-toggle-btn" aria-label="Show/hide password">
                    <input
                      className="password-toggle-check"
                      type="checkbox"
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <span className="password-toggle-indicator"></span>
                  </label>
                  {passwordErrMessage && (
                    <div className="invalid-feedback">{passwordErrMessage}</div>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-2 position-relative">
                <label className="form-label fw-medium">Confirm Password</label>
                <div className="position-relative">
                  <input
                    className={`form-control rounded-2 ${
                      confirmPasswordErrMessage ? "is-invalid" : ""
                    }`}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label className="password-toggle-btn" aria-label="Show/hide password">
                    <input
                      className="password-toggle-check"
                      type="checkbox"
                      onChange={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                    <span className="password-toggle-indicator"></span>
                  </label>
                  {confirmPasswordErrMessage && (
                    <div className="invalid-feedback">
                      {confirmPasswordErrMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                className="btn btn-primary text-light w-100 py-2 rounded-2 fw-medium"
                disabled={loading}
              >
                {loading ? "Loading..." : "Reset"}
              </button>

              {/* Sign Up Option */}
              <p className="text-center mt-2 text-secondary">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary text-decoration-none fw-medium"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
