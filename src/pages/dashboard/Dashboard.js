import React, { useEffect, useState } from "react";
import Topnav from "../../components/Topnav";
import "./dashboard.scss";
import { useNavigate } from "react-router-dom";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import contractAbi from "../../assets/json/abi.json";
import axios from "axios";
import { toast } from "react-toastify";
import { formatUnits, parseEther, parseUnits } from "viem";
import { Modal } from "react-bootstrap";

const Dashboard = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [referralLink, setreferralLink] = useState("");
  const [referralurl, setreferralurl] = useState("");
  const { isConnected, address } = useAccount();

  const [nowTokens, setnowTokens] = useState(0);
  const [modalShow, setModalShow] = React.useState(false);
  const [nowRef, setnowRef] = useState([]);

  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedObject = JSON.parse(user);
    const objectArray = [parsedObject];
    setreferralLink(
      `${process.env.REACT_APP_PROJECT_URL}/signup/${objectArray[0]?.email}`
    );
  }, []);

  useEffect(() => {
    if (isConnected) {
      setreferralurl(
        `${process.env.REACT_APP_PROJECT_URL}/investment/decentralized/${address}`
      );
    }
  }, [isConnected]);

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

  const totalVesting = vestings?.reduce((sum, v) => {
    return sum + Number(v.amountClaimed);
  }, 0);

  useEffect(() => {
    getData();
  }, []);

  // get user summry
  const { data: userSummry } = useReadContract({
    address: process.env.REACT_APP_SMART_CONTRACT,
    abi: contractAbi,
    functionName: "getUserSummary",
    args: [
      address,
      // "0xF594E5931638dbf21f84594769BB1bBcf8D4f12E", // user address
    ],
    enabled: !!address,
  });

  // // get ref list
  // const { data: refList } = useReadContract({
  //   address: process.env.REACT_APP_SMART_CONTRACT,
  //   abi: contractAbi,
  //   functionName: "getUserReferralSummary",
  //   args: [
  //     address
  //     // "0xF594E5931638dbf21f84594769BB1bBcf8D4f12E",
  //     // 0,
  //   ],
  //   enabled: !!address,
  // });

  // get ref list
  const { data: refList } = useReadContract({
    address: process.env.REACT_APP_SMART_CONTRACT,
    abi: contractAbi,
    functionName: "getReferralRecords",
    args: [
      address,
      // "0xF594E5931638dbf21f84594769BB1bBcf8D4f12E",
      // 0,
    ],
    enabled: !!address,
  });

  const totalRefList = refList?.reduce((sum, v) => {
    return sum + Number(v.rewardUSDT);
  }, 0);

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
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/directReferral`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === true) {
          setnowRef(res.data.data);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.message || "Internal server Error");
      });
  }, []);

  const totalrefNow = nowRef?.reduce((sum, v) => {
    return sum + Number(v.credit);
  }, 0);

  function MyVerticallyCenteredModal(props) {
    const [waddress, setWaddress] = useState("");
    const [maxAmo, setmaxAmo] = useState(0);

    useEffect(() => {
      if (totalrefNow && (!maxAmo || Number(totalrefNow) < Number(maxAmo))) {
        setmaxAmo(totalrefNow);
      }
    }, [maxAmo]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        let conAddress = process.env.REACT_APP_SMART_CONTRACT;
        let useradress = waddress;

        console.log("max amo", typeof maxAmo, maxAmo * 1000000000000000000);

        const usdtAmount = maxAmo * 1000000000000000000;

        const tx = await writeContractAsync({
          address: process.env.REACT_APP_SMART_CONTRACT,
          abi: contractAbi,
          functionName: "transRef",
          args: [conAddress, useradress, usdtAmount],
        });

        console.log(tx);
      } catch (e) {
        console.log(e);
      }
    };

    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Widrow Referrals Bounc
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label>Wallet Address</label>
                  <input
                    type="text"
                    placeholder="Enter Your Wallet Address"
                    className="form-control"
                    value={waddress}
                    onChange={(e) => setWaddress(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label>Amount</label>
                  <input
                    type="text"
                    placeholder="Amount You want to wi"
                    className="form-control"
                    value={maxAmo}
                    onChange={(e) => {
                      if (/^\d*\.?\d*$/.test(e.target.value)) {
                        setmaxAmo(e.target.value);
                      }
                    }}
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100">
                    Widrow
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

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
              <i className="fa-solid fa-receipt icon"></i>
            </div>
            <div className="stat-info">
              <h3 className="m-0">Total Bought via wallet</h3>
              <h2 className="m-0">
                {isConnected === false
                  ? 0
                  : totalDeCoin?.toFixed(2) / 1000000000000000000}{" "}
                Wave
              </h2>
            </div>
          </div>

          <div className="stat-card" style={{ maxWidth: "410px" }}>
            <div className="icon-container">
              {/* <FontAwesomeIcon icon={faCoins} className="icon" /> */}
              <i className="fa-solid fa-coins icon"></i>
            </div>
            <div className="stat-info">
              <h3 className="m-0">Total WAVE Allocated and Vesting</h3>
              <h2 className="m-0">2.300cr. WAVE</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-container">
              {/* <FontAwesomeIcon icon={faChartLine} className="icon" /> */}
              <i className="fa-solid fa-hexagon-nodes icon"></i>
            </div>
            <div className="stat-info">
              <h3 className="m-0">Total Claimed In Wallet</h3>
              <h2 className="m-0">
                {isConnected === false ? 0 : totalVesting / 1000000000000000000}{" "}
                WAVE
              </h2>
            </div>
          </div>
        </div>
        <div className="stats-container">
          <div className="stat-card">
            <div className="icon-container">
              {/* <FontAwesomeIcon icon={faWallet} className="icon" /> */}
              <i className="fa-solid fa-dollar icon"></i>
            </div>
            <div className="stat-info">
              <h3 className="m-0">Total Bought via now payments</h3>
              <h2 className="m-0">
                {nowTokens !== undefined ? nowTokens.toFixed(2) : 0} Wave
              </h2>
            </div>
          </div>
        </div>

        {/* Presale Participation Section */}
        <div className="presale-section">
          <div className="no-presale">
            <div className="dashboardy">Dashboard</div>
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
          {/* <div className="referral-card">
            <div className="stat-info">
              <h3>Total Presales</h3>
              <h2>1</h2>
            </div>
          </div> */}

          <div className="referral-card">
            <div className="stat-info">
              <h3>Total Earnings Via Wallet</h3>
              <h2>{totalRefList / 1000000000000000000} USDT</h2>
            </div>
          </div>

          <div className="referral-card">
            <div className="stat-info">
              <h3>Total Earnings Via Now Payments</h3>
              <h2>{} USDT</h2>
            </div>
          </div>
        </div>

        {/* Referral Link Card */}
        <div className="referral-link-card">
          <h3>Referral Link for Centralized Payment</h3>
          <div className="link-container">
            <div className="link-box">
              <span className="link-text">{referralLink}</span>
            </div>
            <button className="action-btn copy-btn" onClick={handleCopy}>
              <i className="fa-solid fa-copy"></i>
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          {isConnected && (
            <>
              <h3 className="mt-3">Referral Link for Decentralized Payment</h3>
              <div
                className="link-container mt-3  overflow-hidden"
                style={{ flexWrap: "nowrap" }}
              >
                <div className="link-box w-75  overflow-hidden">
                  <span className="link-text" onClick={handleCopyAddress}>
                    {referralurl}
                  </span>
                </div>
                <button
                  className="action-btn copy-btn overflow-hidden"
                  onClick={handleCopyAddress}
                >
                  {/* <FontAwesomeIcon icon={copied ? faCircleCheck : faCopy} /> */}
                  <i className="fa-solid fa-copy"></i>
                  <span>{copied2 ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Presale Referrals Card */}
        <div className="presale-referrals-card">
          <h3>Decentralized Payment Referrals</h3>

          {refList?.length === 0 ? (
            <>
              <p>No Referrals Found</p>
            </>
          ) : (
            <>
              <div className="referrals-table">
                <div className="table-header">
                  <div className="table-cell phase">User</div>
                  <div className="table-cell bnb">Reward in USDT</div>
                  <div className="table-cell usd">User spend</div>
                </div>

                {refList?.map((v, i) => (
                  <div className="table-row" key={i}>
                    <div className="table-cell phase">{`${v.referee.slice(
                      0,
                      4
                    )}***${v.referee.slice(-4)}`}</div>
                    <div className="table-cell bnb">
                      {Number(v.rewardUSDT) / 1000000000000000000} USDT
                    </div>
                    <div className="table-cell usd">
                      {Number(v.usdtAmount) / 1000000000000000000} USDT
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="presale-referrals-card mt-3 mb-3">
          <div className="d-flex justify-content-between">
            <h3>Centralized Payment Referrals</h3>
            <div>
              <button
                className="btn btn-primary"
                onClick={() => setModalShow(true)}
              >
                widrow {totalrefNow.toFixed(2)} USDT
              </button>
            </div>
          </div>

          {nowRef?.length === 0 ? (
            <>
              <p>No Referrals Found</p>
            </>
          ) : (
            <>
              <div className="referrals-table">
                <div className="table-header">
                  <div className="table-cell phase">User</div>
                  <div className="table-cell bnb">Reward in USDT</div>
                  <div className="table-cell usd">User spend</div>
                </div>

                {nowRef?.map((v, i) => (
                  <div className="table-row" key={i}>
                    <div className="table-cell phase">{`${v.forReferral.email.slice(
                      0,
                      3
                    )}***${v.forReferral.email.slice(-12)}`}</div>
                    <div className="table-cell bnb">
                      {v.credit.toFixed(2)} USDT
                    </div>
                    <div className="table-cell usd">
                      {(v.credit * 20).toFixed(2)} USDT
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default Dashboard;
