import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import mainbg from "../../assets/images/login-slider.png";
import logo from "../../assets/images/logo.png";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailErrMessage, setEmailErrMessage] = useState("");
  const [passwordErrMessage, setPasswordErrMessage] = useState("");

  const validateForm = () => {
    let isValid = true;
    setEmailErrMessage("");
    setPasswordErrMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailErrMessage("Email is required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailErrMessage("Invalid email format");
      isValid = false;
    } else if (email.length >= 250) {
      setEmailErrMessage("Too long email");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordErrMessage("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordErrMessage("Password must be 8 digits long");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // toast.success("Login successful");
    console.log("Logging in with:", { email, password });

    const formData = {
      email,password
    }

    const {data} = await axios.post(`https://presale.onewave.app/api/login`,formData)

    if (data.message === "Login successful") {
      toast.success(data.message)
      localStorage.setItem("user",data.data.firstName)
      navigate("/presale");
    }

    if (data.status === false) {
      toast.error(data.message)
    }

    // navigate("/dashboard");
  };

  return (
    <>
      {/* Top Branding Bar */}
      <div className="blur-bg py-3 px-4 d-flex justify-content-between align-items-center w-100 shadow-sm position-absolute top-0">
        <img src={logo} alt="Wave Logo" className="img-fluid" style={{maxWidth:"120px"}} />
        <button 
          className="btn btn-primary px-4"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
      </div>

      {/* Background + Centered Form */}
      <div className="login-page position-relative vh-100 mh-100">
        {/* Background Image Overlay */}
        <div className="position-absolute w-100 h-100 bg-dark bg-opacity-10"></div>

        {/* Centered Login Box */}
        <div className="position-absolute translate-centrt w-100 mw-100 px-3">
          <div className="login-box shadow-lg rounded-3 bg-white " style={{ maxWidth: "450px" }}>
            <div className="p-3 pb-0">
              <h2 className="fw-semibold">
                Sign in to <span className="text-primary">Wave</span>
              </h2>
              <p className="text-secondary mb-4">Fill your email and password to sign in</p>
            </div>
            <hr />

            <form className="px-3" onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="mb-2">
                <label className="form-label fw-medium">Email</label>
                <input
                  type="email"
                  className={`form-control rounded-2 ${emailErrMessage ? "is-invalid" : ""}`}
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailErrMessage && <div className="invalid-feedback">{emailErrMessage}</div>}
              </div>

              {/* Password Input */}
              <div className="mb-2 position-relative">
                <label className="form-label fw-medium">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control rounded-2 ${passwordErrMessage ? "is-invalid" : ""}`}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"} />
                </button>
                {passwordErrMessage && <div className="invalid-feedback">{passwordErrMessage}</div>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember"
                  />
                  <label className="form-check-label text-secondary" htmlFor="remember">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-decoration-none text-primary small">
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button type="submit" className="btn btn-primary text-ligh w-100 py-2 rounded-2 fw-medium">
                Sign In
              </button>

              {/* Sign Up Link */}
              <p className="text-center mt-2 text-secondary">
                Don't have an account?{" "}
                <a href="/signup" className="text-primary text-decoration-none fw-medium">
                  Sign Up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
