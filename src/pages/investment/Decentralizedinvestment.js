import React, { useEffect, useState } from "react";
import "./WavePresale.scss";
import Topnav from "../../components/Topnav";
import { useAccount, useDisconnect, useWriteContract } from "wagmi";
import { parseEther, parseUnits } from "viem";
import contractAbi from "../../assets/json/abi.json";
import { useAppKit } from "@reown/appkit/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import usdtcontractAbi from "../../assets/json/usdtAbi.json";
import { useReadContract } from "wagmi";
import { number } from "framer-motion";

export default function WavePresale() {
  const { ref } = useParams();
  const [bnbAmount, setBnbAmount] = useState(0);
  const [waveAmount, setWaveAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const handleBnbChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setBnbAmount(value);
    // Assuming 1 BNB = 5 WAVE (as an example)
    setWaveAmount(value * 5);
  };

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
  const [phaseValuePrice, setPhaseValuePrice] = useState(0);
  const [phaseErrorMessage, setPhaseErrorMessage] = useState("");
  const [amountErrorMessage, setAmountErrorMessage] = useState("");
  const [showBuyNow, setshowBuyNow] = useState(false);
  const [refWallet, setrefWallet] = useState(ref);
  const [loading, setloading] = useState(false);
  const [cPayment, setcPayment] = useState([]);
  const [nowTokens, setnowTokens] = useState(0);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    setShowConnectButton(!isConnected);

    switch (phases) {
      case "1":
        setPhaseValue(2);
        setPhaseValuePrice(0.5);
        break;
      case "2":
        setPhaseValue(1.6666667);
        setPhaseValuePrice(0.6);
        break;
      case "3":
        setPhaseValue(1.42857142857);
        setPhaseValuePrice(0.7);
        break;
      case "4":
        setPhaseValue(1.25);
        setPhaseValuePrice(0.8);
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
    } else if (amount < 10) {
      setAmountErrorMessage("Minimum amount is 10 USDT.");
      valid = false;
    } else {
      setAmountErrorMessage("");
    }

    return valid;
  };

  const { data: totalUsdt } = useReadContract({
    address: process.env.REACT_APP_USDT_SMART_CONTRACT,
    abi: usdtcontractAbi,
    functionName: "balanceOf",
    args: [address],
  });

  const usdtInWallet = Number(totalUsdt) / 1000000000000000000 || 0;

  const approveTransaction = async (e) => {
    e.preventDefault();

    try {
      if (!validateInputs()) return;
      setloading(true);

      if (usdtInWallet <= amounts) {
        toast.error(
          "You do not have enough funds to continue the transaction."
        );
        setloading(false);
        return;
      } else {
        const usdtAmount = parseEther(amounts);
        const approveTx = await writeContractAsync({
          address: process.env.REACT_APP_USDT_SMART_CONTRACT,
          abi: usdtcontractAbi,
          functionName: "approve",
          args: [process.env.REACT_APP_SMART_CONTRACT, usdtAmount],
        });

        try {
          setshowBuyNow(true);
          await handlePurchase(usdtAmount);
        } catch (error) {
          toast.error("Transaction Fail");
        }
      }
    } catch (error) {
      setloading(false);
      toast.error("Approval Failed");
    }
  };

  const handlePurchase = async (usdtAmountParam) => {
    setloading(true);
    try {
      const usdtAmount = parseUnits(amounts, 18);

      const phase = Number(phases - 1);
      const referrer = "0x0000000000000000000000000000000000000000";

      const tx = await writeContractAsync({
        address: process.env.REACT_APP_SMART_CONTRACT,
        abi: contractAbi,
        functionName: "purchaseTokens",
        args: [phase, usdtAmount, referrer],
      });

      const formData = {
        phase: `Phase ${phases}`,
        walletAddress: address,
        trxHash: tx,
        refWalletAddress: referrer,
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
        window.location.reload();
        return
      }
    } catch (error) {
      const formData = {
        phase: `Phase ${phases}`,
        walletAddress: address,
        trxHash: "",
        amountInUsdt: amounts,
        refWalletAddress:
          refWallet || "0x0000000000000000000000000000000000000000",
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
        setloading(false);
      }
    } finally {
      setloading(false);
      setshowBuyNow(false);
      setAmounts(0);
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

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("Claim failed");
    }
  };

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/buy/total`,
        { withCredentials: true }
      );
      if (data.status === true) {
        setnowTokens(data.data.totalWave);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Internal server error");
    }
  };

  useEffect(() => {
    getData();
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/buy/transaction`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === true) {
          setcPayment(res.data.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.message || "Internal server error");
      });
  }, []);

  const { data: totalWave } = useReadContract({
    address: process.env.REACT_APP_SMART_CONTRACT,
    abi: contractAbi,
    functionName: "totalWaveLocked",
  });

  const totalWaveBuy =
    cPayment &&
    cPayment?.reduce((sum, v) => {
      return sum + Number(v.tokenQuantity);
    }, 0);

  let valueWave = Number(totalWave) / 1000000000000000000;
  let x = (valueWave + Number(nowTokens) * 100) / 5700000;
  let width = x;

  const totalDeCoin = vestings?.reduce((sum, v) => {
    return sum + Number(v.amountPurchased);
  }, 0);

  const totalVesting = vestings?.reduce((sum, v) => {
    return sum + Number(v.amountClaimed);
  }, 0);

  return (
    <div className="wave-presale">
      {/* Background and Header */}
      <div className="background-image"></div>

      <Topnav />

      <main className="main-content">
        <h1 className="presale-title">Invest via Wallet</h1>

        {/* Progress section */}
        <div className="progress-section">
          <div className="phase-info">Total Wave</div>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${width}%` }}
              ></div>
            </div>
          </div>
          <div className="tokens-info">57.5 M WAVE</div>
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="card-icon-container">
              <i className="fa-solid fa-file-invoice text-white card-icon"></i>
            </div>
            <div className="card-content">
              <p className="card-label m-0">Your Total Wave Balance</p>
              <p className="card-value">
                {isConnected
                  ? (
                      Number(totalDeCoin) / 1000000000000000000 +
                      totalWaveBuy
                    ).toFixed(2)
                  : 0 + totalWaveBuy.toFixed(2)}{" "}
                WAVE
              </p>
            </div>
          </div>

          <div className="info-card">
            <div className="card-icon-container">
              <i className="fa-solid fa-dollar text-white card-icon"></i>
            </div>
            <div className="card-content">
              <p className="card-label m-0">WAVE Pre-Sale Price</p>
              <p className="card-value">
                {phaseValue ? phaseValuePrice.toFixed(2) : 0} USD
              </p>
            </div>
          </div>

          <div className="info-card">
            <div className="card-icon-container">
              <i className="fa-solid fa-coins text-white card-icon"></i>
            </div>
            <div className="card-content">
              <p className="card-label m-0">Number of vested coins</p>
              <p className="card-value">
                {isConnected
                  ? (Number(totalVesting) / 1000000000000000000).toFixed(2)
                  : 0}{" "}
                WAVE
              </p>
            </div>
          </div>
        </div>

        {/* Buy Section and Transactions */}
        {showConnectButton === false ? (
          <div className="bottom-section">
            {/* Buy Section */}
            <div className="buy-section">
              <h2 className="section-title">Buy WAVE</h2>
              <div className="exchange-container">
                <form>
                  <div className="row g-3">
                    <div className="col-md-12 mb-3 border rounded-3 p-3">
                      <label
                        htmlFor="phase"
                        className="form-label fs-5 fw-semibold text-secondary"
                        style={{ color: "#696969" }}
                      >
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
                    <div className="col-md-12 mb-3 border rounded-3 p-3">
                      <label className="form-label fs-5 fw-semibold text-secondary">
                        You Pay (IN USDT)
                      </label>
                      <input
                        type="text"
                        maxLength="6"
                        className="form-control rounded-2"
                        placeholder="Enter Amount In USDT"
                        value={amounts}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setAmountErrorMessage("");
                            setAmounts(e.target.value);
                          }
                        }}
                      />
                      {amountErrorMessage && (
                        <p className="text-danger m-0 mt-1">
                          {amountErrorMessage}
                        </p>
                      )}
                    </div>
                    <div className="col-md-12 mb-3 border rounded-3 p-3">
                      <label className="form-label fs-5 fw-semibold text-secondary">
                        You Get (IN Wave)
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-2"
                        value={
                          amounts && phaseValue
                            ? (parseFloat(amounts) * phaseValue).toFixed(2)
                            : ""
                        }
                        disabled
                      />
                    </div>
                    {/* <div className="col-md-12 mb-3 border rounded-3 p-3">
                      <label className="form-label fs-5 fw-semibold text-secondary">
                        Ref Wallet Address (optional)
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-2"
                        placeholder="Enter ref wallet address"
                        value={refWallet}
                        onChange={(e) => setrefWallet(e.target.value)}
                      />
                    </div> */}
                  </div>
                </form>
              </div>

              {/* <button className="buy-button">Buy With BNB</button> */}

              <button
                className="btn btn-primary py-3 fs-5"
                // onClick={handlePurchase}
                onClick={approveTransaction}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>{" "}
                    Loading...
                  </>
                ) : (
                  <>Buy Now</>
                )}
              </button>
            </div>

            {/* Transactions Section */}
            <div className="transactions-section">
              <div className="tabs-container">
                <div className={`tab ${activeTab === "your" ? "active" : ""}`}>
                  Your Transactions
                </div>
              </div>

              <div className="row g-3 transactions-list w-100">
                {vestings?.length === 0 && (
                  <div className="card">
                    <h5 className="text-center m-0 p-2">
                      No Transactions Found
                    </h5>
                  </div>
                )}
                {vestings?.map((v, i) => (
                  <div
                    className="col-6 col-md-12 transaction-item w-100"
                    key={i}
                  >
                    <div className="transaction-icon">
                      <i className="fa-solid fa-coins transaction-svg text-white"></i>
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-amounts flex-wrap">
                        <div className="amount-bought">
                          <span className="label">Phase:</span>
                          <span className="value">
                            {" "}
                            Phase {Number(v.phase) + 1}
                          </span>
                        </div>
                        <div className="amount-bought">
                          <span className="label">WAVE Bought:</span>
                          <span className="value">
                            {" "}
                            {(
                              Number(v.amountPurchased) / 1000000000000000000
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="amount-bought">
                          <span className="label">Bought With:</span>
                          <span className="value">
                            {" "}
                            {(
                              Number(v.usdtAmount) / 1000000000000000000
                            ).toFixed(2)}{" "}
                            USDT
                          </span>
                        </div>
                        <div className="amount-bought">
                          <span className="label">Lock In Period:</span>
                          <span className="value">
                            {v.phase === 0n
                              ? 12
                              : v.phase === 1n
                              ? 9
                              : v.phase === 2n
                              ? 6
                              : 3}
                          </span>
                        </div>
                        <div className="amount-bought">
                          <span className="label">Claimed:</span>
                          <span className="value">
                            {" "}
                            {(
                              Number(v.amountClaimed) / 1000000000000000000
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      {(() => {
                        const phase = Number(v.phase); // 0-indexed
                        const lockMonths = [12, 9, 6, 3];
                        const lockInMonths = lockMonths[phase] || 0;

                        const purchaseTime = Number(v.purchaseTime); // seconds
                        const unlockDate = new Date(purchaseTime * 1000);
                        unlockDate.setMonth(
                          unlockDate.getMonth() + lockInMonths
                        );

                        const now = new Date();
                        const isUnlocked = now >= unlockDate;
                        const alreadyClaimed =
                          Number(v.amountClaimed) >= Number(v.amountPurchased);

                        if (!isUnlocked) {
                          return (
                            <button
                              className="btn btn-secondary btn-sm"
                              disabled
                            >
                              Locked
                            </button>
                          );
                        }

                        if (alreadyClaimed) {
                          return (
                            <button className="btn btn-success btn-sm" disabled>
                              Claimed
                            </button>
                          );
                        }

                        return (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleClaim(i)}
                          >
                            Claim
                          </button>
                        );
                      })()}
                      {/* <button
                        className={
                          Number(v.amountClaimed) / 1000000000000000000 === 0
                            ? "btn btn-primary btn-sm"
                            : "btn btn-primary btn-sm point-dis"
                        }
                        onClick={() => handleClaim(i)}
                        disabled={
                          Number(v.amountClaimed) / 1000000000000000000 === 0
                            ? false
                            : true
                        }
                      >
                        Claim
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-3">
            <div className="alert alert-info mb-0 mx-auto w-100 w-md-50 d-flex align-items-center gap-2">
              {/* <i class="fa-solid fa-circle-exclamation me-2 fs-2"></i> */}
              <i class="ai-octagon-alert fs-xl me-2"></i>
              <p className="m-0">Plase Connect Wallet To Invest In Wave</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
