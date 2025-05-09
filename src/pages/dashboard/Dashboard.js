import { useEffect, useState } from "react";
import Topnav from "../../components/Topnav";
import "./dashboard.scss";
import { useNavigate } from "react-router-dom";
import { useAccount, useReadContract } from "wagmi";
import contractAbi from '../../assets/json/abi.json'
import axios from "axios";
import { toast } from "react-toastify";


const Dashboard = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
    const [copied2, setCopied2] = useState(false);
  const [referralLink, setreferralLink] = useState("");
  const [referralurl, setreferralurl] = useState("");
  const { isConnected, address } = useAccount();

  const [nowTokens, setnowTokens] = useState([])

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedObject = JSON.parse(user);
    const objectArray = [parsedObject];
    setreferralLink(
      `${process.env.REACT_APP_PROJECT_URL}/signup/${objectArray[0]?._id}`
    );
  }, []);

  useEffect(() => {
    if (isConnected) {
      setreferralurl(`${process.env.REACT_APP_PROJECT_URL}/investment/decentralized/${address}`)
    }
  
  
  }, [isConnected])
  

  // const referralLink = `${process.env.REACT_APP_PROJECT_URL}/signup/`
  //  "https://onewave.app/presale?referral=0x3Af5783057A282028549dad4031640941A1A2194";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

   const handleCopyAddress = () => {
    navigator.clipboard.writeText(referralurl);
    setCopied2(true);
    setTimeout(() => setCopied2(false), 2000);
  };

  const { data: vestings, isLoading } = useReadContract({
    address: process.env.REACT_APP_SMART_CONTRACT,
    abi: contractAbi,
    functionName: "getVestingRecords",
    args: [address],
    enabled: !!address,
  });

  const totalDeCoin = vestings?.reduce((sum, v) => {
    return sum + Number(v.amountPurchased);
  }, 0);

  const totalVesting = vestings?.reduce((sum,v) => {
    return sum +  Number(v.amountClaimed);
  },0)

  useEffect(() => {
    getData()
  }, [])
  

  const getData = async () => { 
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/buy/total`,{withCredentials:true})
      if (data.status === "success") {
        setnowTokens(data.data)
      }
    } catch (error) {
      toast.error(error.response.data.message||"Internal server error")
    }
   }

useEffect(() => {
  if (!isConnected) {
    toast.info("Please Connect wallet to show data.")
  }
}, [isConnected])

   

  return (
    <div className="dashboard-container">
      <Topnav />

      <div className="main-content">
        <div className="background-image"></div>

        <h1 className="dashboard-title position-relative z-2">Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="icon-container">
              {/* <FontAwesomeIcon icon={faWallet} className="icon" /> */}
              <i class="fa-solid fa-receipt icon"></i>
            </div>
            <div className="stat-info">
              <h3 className="m-0">Total Bought via wallet</h3>
              <h2 className="m-0">{isConnected === false ? (0):totalDeCoin?.toFixed(2)/1000000000000000000} USDT</h2>
            </div>
          </div>

          <div className="stat-card" style={{ maxWidth: "410px" }}>
            <div className="icon-container">
              {/* <FontAwesomeIcon icon={faCoins} className="icon" /> */}
              <i class="fa-solid fa-coins icon"></i>
            </div>
            <div className="stat-info">
              <h3 className="m-0">Total WAVE Allocated and Vesting</h3>
              <h2 className="m-0">2.300cr. WAVE</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-container">
              {/* <FontAwesomeIcon icon={faChartLine} className="icon" /> */}
              <i class="fa-solid fa-hexagon-nodes icon"></i>
            </div>
            <div className="stat-info">
              <h3 className="m-0">Total Claimed In Wallet</h3>
              <h2 className="m-0">{isConnected === false ? (0) : totalVesting /1000000000000000000} WAVE</h2>
            </div>
          </div>
        </div>
        <div className="stats-container">
        <div className="stat-card">
            <div className="icon-container">
              {/* <FontAwesomeIcon icon={faWallet} className="icon" /> */}
              <i class="fa-solid fa-dollar icon"></i>
            </div>
            <div className="stat-info">
              <h3 className="m-0">Total Bought via now payments</h3>
              <h2 className="m-0">0.00 USD</h2>
            </div>
          </div>
        </div>

        {/* Presale Participation Section */}
        <div className="presale-section">
          <div className="no-presale">
            <div class="dashboardy">Dashboard</div>
            <h2 className="text-white">No Presale Participation Found</h2>
            <p>You haven't participated in any presales yet.</p>
            <button
              className="buy-wave-btn"
              onClick={() => navigate("/presale")}
            >
              Buy WAVE
            </button>
          </div>
        </div>

        <h1 className="referrals-title">Referrals Stats</h1>

        {/* Referral Stats Cards */}
        <div className="referral-stats-container">
          <div className="referral-card">
            <div className="stat-info">
              <h3>Total Presales</h3>
              <h2>1</h2>
            </div>
          </div>

          <div className="referral-card">
            <div className="stat-info">
              <h3>Total BNB Earnings</h3>
              <h2>0 BNB</h2>
            </div>
          </div>

          <div className="referral-card">
            <div className="stat-info">
              <h3>Total USD Earnings</h3>
              <h2>$0.000</h2>
            </div>
          </div>
        </div>

        {/* Referral Link Card */}
        <div className="referral-link-card">
          <h3>Your Referral Link</h3>
          <div className="link-container">
            <div className="link-box">
              <span className="link-text">{referralLink}</span>
            </div>
            <button className="action-btn copy-btn" onClick={handleCopy}>
              {/* <FontAwesomeIcon icon={copied ? faCircleCheck : faCopy} /> */}
              <i className="fa-solid fa-copy"></i>
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button className="action-btn share-btn" onClick={handleCopy}>
              {/* <FontAwesomeIcon icon={faShareNodes} /> */}
              <i className="fa-solid fa-share-nodes"></i>
              <span>Share</span>
            </button>
          </div>
          {isConnected && (
            <div className="link-container mt-3  overflow-hidden" style={{flexWrap: "nowrap"}}>
            <div className="link-box w-75  overflow-hidden">
              <span className="link-text" onClick={handleCopyAddress}>{referralurl}</span>
            </div>
            <button className="action-btn copy-btn overflow-hidden" onClick={handleCopyAddress}>
              {/* <FontAwesomeIcon icon={copied ? faCircleCheck : faCopy} /> */}
              <i className="fa-solid fa-copy"></i>
              <span>{copied2 ? "Copied" : "Copy"}</span>
            </button>
            <button className="action-btn share-btn" onClick={handleCopyAddress}>
              {/* <FontAwesomeIcon icon={faShareNodes} /> */}
              <i className="fa-solid fa-share-nodes"></i>
              <span>Share</span>
            </button>
          </div>
          )}
        </div>

        {/* Presale Referrals Card */}
        <div className="presale-referrals-card">
          <h3>Presale Referrals</h3>

          <div className="referrals-table">
            <div className="table-header">
              <div className="table-cell phase">Phase</div>
              <div className="table-cell bnb">BNB</div>
              <div className="table-cell usd">USD</div>
              <div className="table-cell status">Status</div>
              <div className="table-cell actions">Actions</div>
            </div>

            <div className="table-row">
              <div className="table-cell phase">Phase 1</div>
              <div className="table-cell bnb">0 BNB</div>
              <div className="table-cell usd">$ 0.000</div>
              <div className="table-cell status">
                <span className="status-tag no-earnings">No Earnings</span>
              </div>
              <div className="table-cell actions">
                <div className="action-buttons">
                  <button className="withdraw-btn">Withdraw BNB</button>
                  <button className="withdraw-btn">Withdraw USD</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
