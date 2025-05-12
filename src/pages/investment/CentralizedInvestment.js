// import React, { useEffect, useState } from "react";
// import Sidebar from "../../components/Sidebar";
// import { Button } from "react-bootstrap";
// import { useAccount, useDisconnect, useWriteContract } from "wagmi";
// import { parseUnits } from "viem";
// import contractAbi from "../../assets/json/abi.json";
// import { useAppKit } from "@reown/appkit/react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const CentralizedInvestment = () => {
//   const navigate = useNavigate();
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [showcunnectbutton, setshowcunnectbutton] = useState(false);
//   const [amounts, setAmounts] = useState("");
//   const [phases, setphase] = useState("");
//   const [phaseValue, setPhaseValue] = useState(0);
//   const [phaseData, setPhaseData] = useState([]);
//   const [phaseErrorMessage, setPhaseErrorMessage] = useState("");
//   const [amountErrorMessage, setAmountErrorMessage] = useState("");
//   const [history, sethistory] = useState([]);

//   const toggleSidebar = () => {
//     setSidebarCollapsed(!sidebarCollapsed);
//   };

//   useEffect(() => {
//     getPhaseData();

//     switch (phases) {
//       case "0.2":
//         setPhaseValue(5);
//         break;
//       case "0.4":
//         setPhaseValue(2.5);
//         break;
//       case "0.6":
//         setPhaseValue(1.66);
//         break;
//       case "0.8":
//         setPhaseValue(1.25);
//         break;
//       default:
//         setPhaseValue(0);
//     }
//   }, [phases, amounts]);

//   const getPhaseData = async () => {
//     try {
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/buy/phase`,
//         { withCredentials: true }
//       );

//       if (data.status === true) {
//         setPhaseData(data.data);
//       }
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   const validateInputs = () => {
//     let valid = true;

//     if (!phases || isNaN(Number(phases))) {
//       setPhaseErrorMessage("Please select a valid phase.");
//       valid = false;
//     } else {
//       setPhaseErrorMessage("");
//     }

//     const amount = parseFloat(amounts);
//     if (!amount || isNaN(amount)) {
//       setAmountErrorMessage("Please enter a valid amount.");
//       valid = false;
//     } else if (amount < 10) {
//       setAmountErrorMessage("Minimum amount is 10 USDT.");
//       valid = false;
//     } else {
//       setAmountErrorMessage("");
//     }

//     return valid;
//   };

// const handlePurchase = async (e) => {
//   e.preventDefault();
//   try {
//     if (!validateInputs()) return;

//     const pakgeId = phaseData.filter(
//       (element) => +phases === element.tokenPrice
//     );

//     const formData = {
//       amount: 100,
//       packageId: pakgeId[0]?._id,
//       currency: "USD",
//     };

//     const { data } = await axios.post(
//       `${process.env.REACT_APP_BACKEND_URL}/payment/create`,
//       formData,
//       { withCredentials: true }
//     );

//     if (data.invoice_url) {
//       window.open(data.invoice_url);
//     }
//     // if (data.status === "true") {
//     //   toast.success("Transaction Successful")
//     // }
//   } catch (error) {
//     toast.error("Transaction Failed");
//   }
// };

//   const getHistory = async () => {
//     try {
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/buy/transaction`,
//         { withCredentials: true }
//       );

//       if (data.status === true) {
//         sethistory(data.data);
//       }
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   useEffect(() => {
//     getHistory()
//   }, [])

//   return (
//     <>
//       <main className="page-wrapper">
//         <div className="container-fluid  mb-lg-4">
//           <div className="row pt-sm-2 pt-lg-0">
//             <Sidebar
//               collapsed={sidebarCollapsed}
//               toggleSidebar={toggleSidebar}
//             />

//             <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
//               <h1 className="h2 mb-4">Invest with Now Payments</h1>

//               <div className="card border-0  shadow py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
//                 <div className="card-body p-3">
//                   <div className="d-flex justify-content-end gap-3 py-2 px-4">
//                     <button
//                       className="btn btn-primary py-2 px-4 rounded-3"
//                       onClick={() => navigate("/investment/decentralized")}
//                     >
//                       Pay via Wallet
//                     </button>
//                   </div>
//                   <div>
//                     <p className="text-center fw-semibold text-secondary m-0">
//                       Enter amount to continue purchase
//                     </p>
//                     <div className="row g-3">
//                       <div className="col-12 col-md-6">
//                         <div className="pt-3">
//                           <label htmlFor="" className="form-label">
//                             Phase
//                           </label>
//                           <select
//                             className="form-select shadow-none "
//                             aria-label="Default select example"
//                             onChange={(e) => setphase(e.target.value)}
//                           >
//                             <option selected>Select Phase</option>
//                             {phaseData?.map((val, ind) => (
//                               <option key={ind} value={val.tokenPrice}>
//                                 {val.packageName}
//                               </option>
//                             ))}
//                           </select>
//                           {phaseErrorMessage && (
//                             <p className="text-danger m-0 mt-1">
//                               {phaseErrorMessage}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-12 col-md-6">
//                         <div className="pt-3">
//                           <label htmlFor="" className="form-label">
//                             Amount (In USD)
//                           </label>
//                           <input
//                             type="number"
//                             className="form-control  rounded-2"
//                             placeholder="Enter Amount In USD"
//                             onChange={(e) => setAmounts(e.target.value)}
//                           />
//                           {amountErrorMessage && (
//                             <p className="text-danger m-0 mt-1">
//                               {amountErrorMessage}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-12 col-md-6">
//                         <div className="pt-3">
//                           <label htmlFor="wavecoins" className="form-label">
//                             Wave Coins
//                           </label>
//                           <input
//                             id="wavecoins"
//                             type="number"
//                             className="form-control  rounded-2"
//                             value={
//                               amounts && phaseValue
//                                 ? (parseFloat(amounts) * phaseValue).toFixed(2)
//                                 : ""
//                             }
//                             disabled
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="d-flex justify-content-start pt-3 gap-3">
//                       <button
//                         className="btn btn-primary"
//                         onClick={handlePurchase}
//                       >
//                         Buy Now
//                       </button>
//                       <button className="btn btn-secondary">Cancel</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="card border-0  shadow py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
//                 <div className="card-body p-3">
//                   <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
//                     <h2 className="h4 mb-0">Payment History</h2>
//                   </div>
//                   <div className="overflow-auto">
//                     <div className="table table-responsive">
//                       {history.length === 0 ? (
//                         <h5 className="text-center">No Data Found</h5>
//                       ) : (
//                         <table className="table table-striped">
//                           <thead>
//                             <tr>
//                               <th scope="col">#</th>
//                               <th scope="col">Phase</th>
//                               <th scope="col">Aamount(In USD)</th>
//                               <th scope="col">Wave Qty</th>
//                               <th scope="col">Status</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {history?.map((val, ind) => (
//                               <tr key={ind}>
//                                 <th scope="row">{ind + 1}</th>
//                                 <td>{val.phase}</td>
//                                 <td>{val.amount}</td>
//                                 <td>{val.tokenQuantity}</td>
//                                 <td
//                                   className={
//                                     val.status === "Success"
//                                       ? "text-success"
//                                       : "text-danger"
//                                   }
//                                 >
//                                   {val.status}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// };

// export default CentralizedInvestment;

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

  useEffect(() => {
    getPhaseData();
    getHistory();

    switch (phases) {
      case "1":
        setPhaseValue(5);
        setPhaseValuePrice(0.2);
        break;
      case "2":
        setPhaseValue(2.5);
        setPhaseValuePrice(0.4);
        break;
      case "3":
        setPhaseValue(1.66);
        setPhaseValuePrice(0.6);
        break;
      case "4":
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
    } else if (amount < 1) {
      setAmountErrorMessage("Minimum amount is 10 USDT.");
      valid = false;
    } else {
      setAmountErrorMessage("");
    }

    return valid;
  };

  const handlePurchase = async (usdtAmountParam) => {
    setloading(true);
    try {
      if (!validateInputs()) return;

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
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/buy/transaction`, { withCredentials: true })
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

  let valueWave = Number(totalWave) / 1000000000000000000;
  let x = (valueWave * 100) / 23000000;
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
          <div className="tokens-info">2.30cr WAVE</div>
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="card-icon-container">
              <i className="fa-solid fa-file-invoice text-white card-icon"></i>
            </div>
            <div className="card-content">
              <p className="card-label m-0">Your Total Wave Balance</p>
              <p className="card-value">{(Number(totalDeCoin)/1000000000000000000).toFixed(2)} WAVE</p>
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
                        type="number"
                        className="form-control rounded-2"
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
                        <span className="value"> Phase {v.phase}</span>
                      </div>
                      <div className="amount-bought">
                        <span className="label">WAVE Bought:</span>
                        <span className="value">
                          {" "}
                          {v.tokenQuantity?.toFixed(2)}
                        </span>
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
