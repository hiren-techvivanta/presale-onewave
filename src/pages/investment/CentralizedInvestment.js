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
        `${process.env.REACT_APP_BACKEND_URL}/buy/phase`, { withCredentials: true}
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

      const pakgeId = phaseData.filter((element) => +phases === element.tokenPrice)      

      const formData = {
        amount: 100,
        packageId: pakgeId[0]?._id,
        currency: "USD",
      };

      const {data} = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payment/create`,formData,{withCredentials: true})

      if (data.invoice_url) {
        window.open(data.invoice_url)
      }
      // if (data.status === "true") {
      //   toast.success("Transaction Successful")
      // }
    } catch (error) {
      toast.error("Transaction Failed" )
    }
  };

  return (
    <>
      <div className="admin-layout">
        <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />

        <div className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
          <div className="content-header">
            <Button
              variant="light"
              className="d-md-none me-2"
              onClick={toggleSidebar}
            >
              <i className="fa-solid fa-list"></i>
              {/* <List size={20} /> */}
            </Button>
            <h2></h2>
          </div>

          <div className="content-body p-4 d-flex flex-column gap-3">
            <div>
              <h3>Invest in Wavecoin</h3>
              <p className="text-secondary fw-semibold">
                Buy wavecoin with decentralized wallets
              </p>
            </div>

            <div className="card bg-white border-0 rounded-3 shadow p-3">
              <div className="card-body">
                <div className="d-flex justify-content-end gap-3 py-2 px-4">
                  <button
                    className="btn btn-primary py-2 px-4 rounded-3"
                    onClick={() => navigate("/investment/decentralized")}
                  >
                    Pay via Wallet
                  </button>
                </div>
                <div>
                  <p className="text-center fw-semibold text-secondary">
                    Enter amount to continue purchase
                  </p>
                  <div className="pt-3">
                    <label htmlFor="" className="form-label">
                      Phase
                    </label>
                    <select
                      class="form-select shadow-none w-50"
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
                  <div className="pt-3">
                    <label htmlFor="" className="form-label">
                      Amount (In USD)
                    </label>
                    <input
                      type="number"
                      className="form-control w-50 rounded-2"
                      placeholder="Enter Amount In USD"
                      onChange={(e) => setAmounts(e.target.value)}
                    />
                    {amountErrorMessage && (
                      <p className="text-danger m-0 mt-1">
                        {amountErrorMessage}
                      </p>
                    )}
                  </div>
                  <div className="pt-3">
                    <label htmlFor="wavecoins" className="form-label">
                      Wave Coins
                    </label>
                    <input
                      id="wavecoins"
                      type="number"
                      className="form-control w-50 rounded-2"
                      value={
                        amounts && phaseValue
                          ? (parseFloat(amounts) * phaseValue).toFixed(2)
                          : ""
                      }
                      disabled
                    />
                  </div>
                  <div className="d-flex justify-content-start pt-3 gap-3">
                    <button
                      className="btn btn-primary px-4 py-2 rounded-3"
                      onClick={handlePurchase}
                    >
                      Buy Now
                    </button>
                    <button className="btn btn-secondary px-4 py-2 rounded-3">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-white border-0 rounded-3 shadow p-3">
              <div className="card-body">
                <p className="text-center fw-semibold text-secondary">
                  Investment History
                </p>

                <h5 className="text-center">No History Found</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CentralizedInvestment;
