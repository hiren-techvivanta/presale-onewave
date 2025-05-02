import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/images/logo.png";
import axios from "axios";
import OtpInput from "react-otp-input";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedObject = JSON.parse(user);
    const objectArray = [parsedObject];
    if (objectArray[0] !== null) {
      navigate("/presale");
    }
  }, []);

  const handleLogin = async () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/emailVerification/${otp}`)
      .then((res) => {
        if (res.data.status === true) {
          toast.success(res.data.message);
          toast.info(
            "Now sign in with the email and password you used during signup"
          );
          navigate("/signin");
        }

        if (res.data.status === false) {
          toast.error(res.data.message);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  useEffect(() => {
    if (otp?.length === 6) {
      handleLogin();
    }
  }, [otp]);

  const handleKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  return (
    <>
      {/* Top Branding Bar */}
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
          Sign in
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
              <h2 className="fw-semibold">
                Sign up to <span className="text-primary">Wave</span>
              </h2>
              <p className="text-secondary mb-4">Fill OTP to sign up</p>
            </div>
            <hr />

            <form className="px-3">
              {/* Email Input */}
              <div className="mb-3 py-4">
                <label className="form-label fw-medium">Enter Otp</label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  containerStyle={"w-100"}
                  inputStyle={"form-control rounded-2 w-100"}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      onKeyPress={(e) => {
                        handleKeyPress(e);
                        props.onKeyPress?.(e);
                      }}
                    />
                  )}
                />
              </div>

              {/* Sign In Button */}
              {/* <button
                type="submit"
                className="btn btn-primary text-ligh w-100 py-2 rounded-2 fw-medium"
              >
                Verify
              </button> */}

              {/* Sign Up Link */}
              <p className="text-center mt-2 text-secondary">
                Don't have an account?{" "}
                <a
                  href="/signin"
                  className="text-primary text-decoration-none fw-medium"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;
