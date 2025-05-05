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

const Investments = () => {
  const navigate = useNavigate();
  const { open, close } = useAppKit();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(false);
  const [amounts, setAmounts] = useState("");
  const [phases, setPhase] = useState("");
  const [phaseValue, setPhaseValue] = useState(0);
  const [phaseErrorMessage, setPhaseErrorMessage] = useState("");
  const [amountErrorMessage, setAmountErrorMessage] = useState("");
  const [history, sethistory] = useState([])

  const config = {
    withCredentials: true,
  };
  
  console.log(phases);
  

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    setShowConnectButton(!isConnected);
    getHistory()

    switch (phases) {
      case "1":
        setPhaseValue(5);
        break;
      case "2":
        setPhaseValue(2.5);
        break;
      case "3":
        setPhaseValue(1.66);
        break;
      case "4":
        setPhaseValue(1.25);
        break;
      default:
        setPhaseValue(0);
    }
  }, [isConnected, phases]);

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

  const handlePurchase = async () => {
    try {
      if (!validateInputs()) return;

      const usdtAmount = parseUnits(amounts, 18);
      const phase = Number(phases);
      const referrer = "0x0000000000000000000000000000000000000000";

      const tx = await writeContractAsync({
        abi: contractAbi,
        address: process.env.REACT_APP_SMART_CONTRACT,
        functionName: "purchaseTokens",
        args: [phase, usdtAmount, referrer],
      });

      const formData = {
        phase:`Phase ${phases}`,
        walletAddress:address,
        trxHash: tx.hash,
        amountInUsdt: amounts,
        waveQty: (parseFloat(amounts) * phaseValue).toFixed(2),
        status:"Success"
      }

      const {data} = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/buy/dapp/token`,formData,{withCredentials:true})

      if (data.status === true) {
        toast.success("Transaction Successfull")
      }


    } catch (error) {
      console.log(error.request);
      
      const formData = {
        phase:`Phase ${phases}`,
        walletAddress:address,
        trxHash: "",
        amountInUsdt: amounts,
        waveQty: (parseFloat(amounts) * phaseValue).toFixed(2),
        status:"Success"
      }

      const {data} = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/buy/dapp/token`,formData,{withCredentials:true})

      if (data.status === true) {
        toast.error("Transaction Failed")
      }
    }
  };

  const getHistory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/buy/dapp/transaction`,{withCredentials: true,}
      );

      if (data.status === true) {
        sethistory(data.data)
      }
    } catch (e) {
      toast.error(e.response.data.message)
    }

  };

  return (
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
          </Button>
          <h2></h2>
        </div>

        <div className="content-body p-4 d-flex flex-column gap-3">
          <div>
            <h3>Invest in Wavecoin</h3>
            <p className="text-secondary fw-semibold">
              Buy Wavecoin with decentralized wallets
            </p>
          </div>

          <div className="card bg-white border-0 rounded-3 shadow p-3">
            <div className="card-body">
              {showConnectButton ? (
                <div className="text-end">
                  <button
                    className="btn btn-primary py-2 px-4 rounded-3"
                    onClick={open}
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-end gap-3 py-2 px-4">
                    <button
                      className="btn btn-primary py-2 px-4 rounded-3"
                      onClick={disconnect}
                    >
                      Disconnect Wallet
                    </button>
                    <button
                      className="btn btn-primary py-2 px-4 rounded-3"
                      onClick={() => navigate("/investment/centralized")}
                    >
                      Pay via Now Payments
                    </button>
                  </div>

                  <p className="text-center fw-semibold text-secondary">
                    Enter amount to continue purchase
                  </p>

                  <div className="pt-3">
                    <label htmlFor="phase" className="form-label">
                      Phase
                    </label>
                    <select
                      id="phase"
                      className="form-select shadow-none w-50"
                      value={phases}
                      onChange={(e) => {
                        setPhaseErrorMessage("");
                        setPhase(e.target.value);
                      }}
                    >
                      <option value="">Select Phase</option>
                      <option value="1">Phase 1</option>
                      <option value="2">Phase 2</option>
                      <option value="3">Phase 3</option>
                      <option value="4">Phase 4</option>
                    </select>
                    {phaseErrorMessage && (
                      <p className="text-danger m-0 mt-1">
                        {phaseErrorMessage}
                      </p>
                    )}
                  </div>

                  <div className="pt-3">
                    <label htmlFor="amount" className="form-label">
                      Amount (IN USDT)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      className="form-control w-50 rounded-2"
                      placeholder="Enter Amount In USDT"
                      onChange={(e) => {
                        setAmountErrorMessage("");
                        setAmounts(e.target.value);
                      }}
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
                </>
              )}
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
  );
};

export default Investments;
