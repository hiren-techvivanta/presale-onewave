import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useAccount, useDisconnect, useWriteContract } from "wagmi";
import { parseEther, parseUnits } from "viem";
import contractAbi from "../../assets/json/abi.json";
import { useAppKit } from "@reown/appkit/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import usdtcontractAbi from "../../assets/json/usdtAbi.json";
import { useReadContract } from "wagmi";

const Investments = () => {
  const navigate = useNavigate();
  const { ref } = useParams();

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
  const [history, sethistory] = useState([]);
  const [showBuyNow, setshowBuyNow] = useState(false);
  const [refWallet, setrefWallet] = useState("");

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    setShowConnectButton(!isConnected);
    getHistory();

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

  useEffect(() => {
    if (ref) {
      setrefWallet(ref);
    }
  }, [ref]);

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
    } else if (amount < 1) {
      setAmountErrorMessage("Minimum amount is 10 USDT.");
      valid = false;
    } else {
      setAmountErrorMessage("");
    }

    return valid;
  };

  const approveTransaction = async (e) => {
    e.preventDefault();
    try {
      if (!validateInputs()) return;

      const usdtAmount = parseEther(amounts);
      const approveTx = await writeContractAsync({
        address: process.env.REACT_APP_USDT_SMART_CONTRACT,
        abi: usdtcontractAbi,
        functionName: "approve",
        args: [process.env.REACT_APP_SMART_CONTRACT, usdtAmount],
      });

      setshowBuyNow(true);
      // await handlePurchase(usdtAmount);
    } catch (error) {
      console.log(error);
      // toast.error("Approval Failed");
    }
  };

  const handlePurchase = async (usdtAmountParam) => {
    try {
      const usdtAmount = parseUnits(amounts, 18);
      console.log(usdtAmount);

      const phase = Number(phases - 1);
      const referrer =
        refWallet || "0x0000000000000000000000000000000000000000";

      const tx = await writeContractAsync({
        address: process.env.REACT_APP_SMART_CONTRACT,
        abi: contractAbi,
        functionName: "purchaseTokens",
        args: [phase, usdtAmount, referrer],
      });

      console.log(tx);

      const formData = {
        phase: `Phase ${phases}`,
        walletAddress: address,
        trxHash: tx,
        amountInUsdt: amounts,
        waveQty: (parseFloat(amounts) * phaseValue).toFixed(2),
        status: "Success",
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/buy/dapp/token`,
        formData,
        { withCredentials: true }
      );

      if (data.status === true) {
        toast.success("Transaction Successful");
      }
      setshowBuyNow(false);
      setAmounts(0);
    } catch (error) {
      console.log(error);

      const formData = {
        phase: `Phase ${phases}`,
        walletAddress: address,
        trxHash: "",
        amountInUsdt: amounts,
        waveQty: (parseFloat(amounts) * phaseValue).toFixed(2),
        status: "Failed",
      };

      setshowBuyNow(false);
      setAmounts(0);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/buy/dapp/token`,
        formData,
        { withCredentials: true }
      );

      if (data.status === true) {
        toast.error("Transaction Failed");
      }
    }
  };

  const getHistory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/buy/dapp/transaction`,
        { withCredentials: true }
      );

      if (data.status === true) {
        sethistory(data.data);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const { data: vestings, isLoading } = useReadContract({
    address: process.env.REACT_APP_SMART_CONTRACT,
    abi: contractAbi,
    functionName: "getVestingRecords",
    args: [address],
    enabled: !!address,
  });

  const handleClaim = async (vestingId) => {
    try {
      const tx = await writeContractAsync({
        address: process.env.REACT_APP_SMART_CONTRACT,
        abi: contractAbi,
        functionName: "claimTokens",
        args: [vestingId],
      });

      toast.success("Claim transaction sent!");
      console.log("Claim TX:", tx);
    } catch (error) {
      console.error("Claim failed:", error);
      toast.error("Claim failed");
    }
  };

  return (
    <>
      <main className="page-wrapper">
        <div className="container-fluid mb-lg-4">
          <div className="row pt-sm-2 pt-lg-0">
            <Sidebar
              collapsed={sidebarCollapsed}
              toggleSidebar={toggleSidebar}
            />

            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
              <h1 className="h2 mb-4">Invest With Wallet</h1>

              <div className="card border-0 shadow py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body p-3">
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
                      <div className="d-flex justify-content-end flex-column flex-lg-row gap-3 py-2 px-4">
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

                      <p className="text-center fw-semibold m-0 text-secondary">
                        Enter amount to continue purchase
                      </p>

                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <div className="pt-3">
                            <label htmlFor="phase" className="form-label">
                              Phase
                            </label>
                            <select
                              id="phase"
                              className="form-select shadow-none "
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
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="pt-3">
                            <label htmlFor="amount" className="form-label">
                              Amount (IN USDT)
                            </label>
                            <input
                              id="amount"
                              type="number"
                              className="form-control  rounded-2"
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
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="pt-3">
                            <label htmlFor="amount" className="form-label">
                              Ref Wallet Address (Optinal)
                            </label>
                            <input
                              type="text"
                              className="form-control rounded-2"
                              placeholder="Enter ref wallet address"
                              value={refWallet}
                              onChange={(e) => setrefWallet(e.target.value)}
                            />
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
                                  ? (parseFloat(amounts) * phaseValue).toFixed(
                                      2
                                    )
                                  : ""
                              }
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-start pt-3 gap-3">
                        {showBuyNow === true ? (
                          <button
                            className="btn btn-primary"
                            // onClick={handlePurchase}
                            onClick={handlePurchase}
                          >
                            Buy Now
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            // onClick={handlePurchase}
                            onClick={approveTransaction}
                          >
                            Approve Now
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="card border-0 shadow py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
                    <h2 className="h4 mb-0">Payment History</h2>
                  </div>
                  <div className="overflow-auto">
                    <div className="table table-responsive">
                      {vestings === undefined ? (
                        <p>No History Found</p>
                      ) : (
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th scope="col">Phase</th>
                              <th scope="col">Purchased Amount</th>
                              <th scope="col">Claimed Amount</th>
                              <th scope="col">Purchase Time</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vestings?.map((v, i) => (
                              <tr key={i}>
                                <td>Phase {Number(v.phase) + 1}</td>
                                <td>
                                  {(
                                    Number(v.amountPurchased) /
                                    1000000000000000000
                                  ).toFixed(2)}{" "}
                                  USDT
                                </td>
                                <td>
                                  {(
                                    Number(v.amountClaimed) /
                                    1000000000000000000
                                  ).toFixed(2)}
                                </td>
                                <td>
                                  {new Date(
                                    Number(v.purchaseTime) * 1000
                                  ).toLocaleString()}
                                </td>
                                <td>
                                  <button
                                    className={
                                      Number(v.amountClaimed) /
                                        1000000000000000000 ===
                                      0
                                        ? "btn btn-primary btn-sm"
                                        : "btn btn-primary btn-sm point-dis"
                                    }
                                    onClick={() => handleClaim(i)}
                                    disabled={
                                      Number(v.amountClaimed) /
                                        1000000000000000000 ===
                                      0
                                        ? false
                                        : true
                                    }
                                  >
                                    Claim
                                  </button>
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

export default Investments;
