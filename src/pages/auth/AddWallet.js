import React, { useState } from "react";
import Topnav from "../../components/Topnav";
import OTPInput from "react-otp-input";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddWallet = () => {
    const navigate = useNavigate()
  const [show, setShow] = useState("1"); // Start from wallet form
  const [walletAddress, setWalletAddress] = useState("");
  const [walletError, setWalletError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  const validateWallet = () => {
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!walletAddress.trim()) {
      setWalletError("Wallet address is required.");
      return false;
    } else if (!ethRegex.test(walletAddress)) {
      setWalletError("Enter a valid wallet address.");
      return false;
    }
    setWalletError("");
    return true;
  };

  const handleWalletSubmit = async (e) => {
    e.preventDefault();
    if (!validateWallet()) {
      return;
    }

    const formData = {
      walletAddress: walletAddress,
    };
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/add/address`,
        formData,
        { withCredentials: true }
      );
      if (data.status === true) {
        toast.success(data.message);
        setShow("2");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal server error");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError("Please enter a 6-digit OTP.");
    } else {
      setOtpError("");

      const formData = {
        otp,
      };
      try {
        const { data } = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/verify/address`,
          formData,
          { withCredentials: true }
        );

        if (data.status === true) {
          toast.success(data.message);
          navigate("/dashboard")
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Internal server error");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Topnav />
      <div className="row pt-5">
        <div className="col-lg-4 col-md-6 col-12 mx-auto">
          {show === "1" && (
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleWalletSubmit}>
                  <h5 className="text-center">Add Wallet Address</h5>
                  <label className="form-label">Wallet Address</label>
                  <input
                    type="text"
                    placeholder="Enter Wallet Address"
                    className={`form-control ${
                      walletError ? "is-invalid" : ""
                    }`}
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                  {walletError && (
                    <div className="invalid-feedback">{walletError}</div>
                  )}

                  <div className="mt-3">
                    <button type="submit" className="btn btn-primary w-100">
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {show === "2" && (
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleOtpSubmit}>
                  <h5 className="text-center">Verify With OTP</h5>
                  <OTPInput
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
                  {otpError && (
                    <div className="text-danger mt-2 text-center">
                      {otpError}
                    </div>
                  )}
                  <div className="mt-3">
                    <button type="submit" className="btn btn-primary w-100">
                      Verify OTP
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddWallet;
