import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Button } from "react-bootstrap";
import { useAccount, useDisconnect, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import contractAbi from "../../assets/json/abi.json";
import { useAppKit } from "@reown/appkit/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CentralizedInvestment = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showcunnectbutton, setshowcunnectbutton] = useState(false);
  const [amounts, setAmounts] = useState("");
  const [phases, setphase] = useState("");
  const [phaseValue, setPhaseValue] = useState(0);
  const [phaseData, setPhaseData] = useState([]);
  const [phaseErrorMessage, setPhaseErrorMessage] = useState("");
  const [amountErrorMessage, setAmountErrorMessage] = useState("");
  const [history, sethistory] = useState([]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    getPhaseData();

    switch (phases) {
      case "0.2":
        setPhaseValue(5);
        break;
      case "0.4":
        setPhaseValue(2.5);
        break;
      case "0.6":
        setPhaseValue(1.66);
        break;
      case "0.8":
        setPhaseValue(1.25);
        break;
      default:
        setPhaseValue(0);
    }
  }, [phases, amounts]);

  const getPhaseData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/buy/phase`,
        { withCredentials: true }
      );

      if (data.status === true) {
        setPhaseData(data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const validateInputs = () => {
    let valid = true;

    if (!phases || isNaN(Number(phases))) {
      setPhaseErrorMessage("Please select a valid phase.");
      valid = false;
    } else {
      setPhaseErrorMessage("");
    }

    const amount = parseFloat(amounts);
    if (!amount || isNaN(amount)) {
      setAmountErrorMessage("Please enter a valid amount.");
      valid = false;
    } else if (amount < 10) {
      setAmountErrorMessage("Minimum amount is 10 USDT.");
      valid = false;
    } else {
      setAmountErrorMessage("");
    }

    return valid;
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      if (!validateInputs()) return;

      const pakgeId = phaseData.filter(
        (element) => +phases === element.tokenPrice
      );

      const formData = {
        amount: 100,
        packageId: pakgeId[0]?._id,
        currency: "USD",
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/payment/create`,
        formData,
        { withCredentials: true }
      );

      if (data.invoice_url) {
        window.open(data.invoice_url);
      }
      // if (data.status === "true") {
      //   toast.success("Transaction Successful")
      // }
    } catch (error) {
      toast.error("Transaction Failed");
    }
  };

  const getHistory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/buy/transaction`,
        { withCredentials: true }
      );

      if (data.status === true) {
        sethistory(data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getHistory()
  }, [])
  

  return (
    <>
      <main class="page-wrapper">
        <div class="container-fluid  mb-lg-4">
          <div class="row pt-sm-2 pt-lg-0">
            <Sidebar
              collapsed={sidebarCollapsed}
              toggleSidebar={toggleSidebar}
            />

            <div class="col-lg-9 pt-4 pb-2 pb-sm-4">
              <h1 class="h2 mb-4">Invest with Now Payments</h1>

              <div class="card border-0  shadow py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div class="card-body p-3">
                  <div className="d-flex justify-content-end gap-3 py-2 px-4">
                    <button
                      className="btn btn-primary py-2 px-4 rounded-3"
                      onClick={() => navigate("/investment/decentralized")}
                    >
                      Pay via Wallet
                    </button>
                  </div>
                  <div>
                    <p className="text-center fw-semibold text-secondary m-0">
                      Enter amount to continue purchase
                    </p>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <div className="pt-3">
                          <label htmlFor="" className="form-label">
                            Phase
                          </label>
                          <select
                            class="form-select shadow-none "
                            aria-label="Default select example"
                            onChange={(e) => setphase(e.target.value)}
                          >
                            <option selected>Select Phase</option>
                            {phaseData?.map((val, ind) => (
                              <option key={ind} value={val.tokenPrice}>
                                {val.packageName}
                              </option>
                            ))}
                          </select>
                          {phaseErrorMessage && (
                            <p className="text-danger m-0 mt-1">
                              {phaseErrorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="pt-3">
                          <label htmlFor="" className="form-label">
                            Amount (In USD)
                          </label>
                          <input
                            type="number"
                            className="form-control  rounded-2"
                            placeholder="Enter Amount In USD"
                            onChange={(e) => setAmounts(e.target.value)}
                          />
                          {amountErrorMessage && (
                            <p className="text-danger m-0 mt-1">
                              {amountErrorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="pt-3">
                          <label htmlFor="wavecoins" className="form-label">
                            Wave Coins
                          </label>
                          <input
                            id="wavecoins"
                            type="number"
                            className="form-control  rounded-2"
                            value={
                              amounts && phaseValue
                                ? (parseFloat(amounts) * phaseValue).toFixed(2)
                                : ""
                            }
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start pt-3 gap-3">
                      <button
                        className="btn btn-primary"
                        onClick={handlePurchase}
                      >
                        Buy Now
                      </button>
                      <button className="btn btn-secondary">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card border-0  shadow py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
                    <h2 class="h4 mb-0">Payment History</h2>
                  </div>
                  <div className="overflow-auto">
                    <div class="table table-responsive">
                      {history.length === 0 ? (
                        <h5 className="text-center">No Data Found</h5>
                      ) : (
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Phase</th>
                              <th scope="col">Aamount(In USD)</th>
                              <th scope="col">Wave Qty</th>
                              <th scope="col">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {history?.map((val, ind) => (
                              <tr key={ind}>
                                <th scope="row">{ind + 1}</th>
                                <td>{val.phase}</td>
                                <td>{val.amount}</td>
                                <td>{val.tokenQuantity}</td>
                                <td
                                  className={
                                    val.status === "Success"
                                      ? "text-success"
                                      : "text-danger"
                                  }
                                >
                                  {val.status}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CentralizedInvestment;
