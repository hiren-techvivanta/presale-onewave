import React, { useEffect, useState } from "react";
import "./WavePresale.scss";
import Topnav from "../../components/Topnav";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAccount, useReadContract } from "wagmi";
import contractAbi from "../../assets/json/abi.json";

export default function WavePresale() {
  const [activeTab, setActiveTab] = useState("all");

  const navigate = useNavigate();
  const { isConnected, address } = useAccount();

  const [showConnectButton, setShowConnectButton] = useState(false);
  const [amounts, setAmounts] = useState("");
  const [phases, setPhase] = useState("");
  const [phaseValue, setPhaseValue] = useState(0);
  const [phaseValuePrice, setPhaseValuePrice] = useState(0);
  const [phaseErrorMessage, setPhaseErrorMessage] = useState("");
  const [amountErrorMessage, setAmountErrorMessage] = useState("");
  const [history, sethistory] = useState([]);
  const [loading, setloading] = useState(false);
  const [phaseData, setPhaseData] = useState([]);
  const [cPayment, setcPayment] = useState("");
  const [nowTokens, setnowTokens] = useState(0);

  useEffect(() => {
    getPhaseData();
    getHistory();

    switch (phases) {
      case "0.5":
        setPhaseValue(2);
        setPhaseValuePrice(0.5);
        break;
      case "0.6":
        setPhaseValue(1.6666667);
        setPhaseValuePrice(0.6);
        break;
      case "0.7":
        setPhaseValue(1.42857142857);
        setPhaseValuePrice(0.7);
        break;
      case "0.8":
        setPhaseValue(1.25);
        setPhaseValuePrice(0.8);
        break;
      default:
        setPhaseValue(0);
    }
  }, [phases]);

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

  const handlePurchase = async (usdtAmountParam) => {
    try {
      if (!validateInputs()) return;
      setloading(true);

      const pakgeId = phaseData.filter(
        (element) => +phases === element.tokenPrice
      );

      const formData = {
        amount: amounts,
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
        setloading(false);
      }
    } catch (error) {
      setloading(false);
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

  useEffect(() => {
    getData();
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/buy/transaction`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === "success") {
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

  const totalWaveBuy = history?.reduce((sum, v) => {
    return sum + Number(v.tokenQuantity);
  }, 0);

  let valueWave = Number(totalWave) / 1000000000000000000;
  let x = (valueWave + Number(nowTokens) * 100) / 23000000;
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
        <h1 className="presale-title">Invest via Now Payments</h1>

        {/* Progress section */}
        <div className="progress-section">
          <div className="phase-info">Phase 1</div>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${width}%` }}
              ></div>
            </div>
          </div>
          <div className="tokens-info">230 M WAVE</div>
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
                  ? ((Number(totalDeCoin) / 1000000000000000000) + (totalWaveBuy)).toFixed(2)
                  : 0 + totalWaveBuy.toFixed(2)} WAVE
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
        </div>

        {/* Buy Section and Transactions */}
        <div className="bottom-section">
          {/* Buy Section */}
          <div className="buy-section">
            <h2 className="section-title">Buy WAVE</h2>
            <div className="exchange-container">
              {!showConnectButton && (
                <form>
                  <div className="row g-3">
                    <div className="col-6 col-md-12 mb-3 border rounded-3 p-3">
                      <label
                        htmlFor="phase"
                        className="form-label fs-5 fw-semibold text-secondary"
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
                    <div className="col-6 col-md-12 mb-3 border rounded-3 p-3">
                      <label className="form-label fs-5 fw-semibold text-secondary">
                        You Pay (IN USDT)
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-2"
                        placeholder="Enter Amount In USDT"
                        maxLength={6}
                        value={amounts}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only digits
                          if (/^\d*$/.test(value)) {
                            setAmountErrorMessage("");
                            setAmounts(value);
                          }
                        }}
                      />

                      {amountErrorMessage && (
                        <p className="text-danger m-0 mt-1">
                          {amountErrorMessage}
                        </p>
                      )}
                    </div>
                    <div className="col-6 col-md-12 mb-3 border rounded-3 p-3">
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
                  </div>
                </form>
              )}
            </div>
            <button
              className="btn btn-primary py-3 fs-5"
              // onClick={handlePurchase}
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? <>Loading...</> : <>Buy Now</>}
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
              {history?.length === 0 && (
                <div className="card">
                  <h5 className="text-center m-0 p-2">No Transactions Found</h5>
                </div>
              )}
              {history?.map((v, i) => (
                <div className="col-6 col-md-12 transaction-item w-100" key={i}>
                  <div className="transaction-icon">
                    <i className="fa-solid fa-coins transaction-svg text-white"></i>
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-amounts flex-wrap">
                      <div className="amount-bought">
                        <span className="label">Phase:</span>
                        <span className="value">{v.phase}</span>
                      </div>
                      <div className="amount-bought">
                        <span className="label">WAVE Bought:</span>
                        <span className="value">
                          {" "}
                          {v.tokenQuantity?.toFixed(2)}
                        </span>
                      </div>
                      <div className="amount-bought">
                        <span className="label">Bought With:</span>
                        <span className="value"> {v.amount} USDT</span>
                      </div>
                      <div className="amount-bought">
                        <span className="label">Lock In Period:</span>
                        <span className="value"> {v.lockingPeriod}</span>
                      </div>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
