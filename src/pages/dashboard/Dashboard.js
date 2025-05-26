import React, { useEffect, useState } from "react";
import Topnav from "../../components/Topnav";
import "./dashboard.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import contractAbi from "../../assets/json/abi.json";
import axios from "axios";
import { toast } from "react-toastify";
import { formatUnits, parseEther, parseUnits } from "viem";
import { Modal } from "react-bootstrap";
import OTPInput from "react-otp-input";

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
  const [totalrefNow, settotalrefNow] = useState(0);
  const [history, sethistory] = useState([]);

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

  // get ref list
  const { data: refList } = useReadContract({
    address: process.env.REACT_APP_SMART_CONTRACT,
    abi: contractAbi,
    functionName: "getReferralRecords",
    args: [address],
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

  const totalrefNow2 = nowRef?.reduce((sum, v) => {
    return sum + Number(v.credit);
  }, 0);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/referral/balance`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === true) {
          settotalrefNow(res.data.data.balance);
        }
      })
      .catch((e) => {
        toast.error(e.response.data.message || "Internal server error");
      });
  }, []);

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

  useEffect(() => {
    getHistory();
  }, []);

  function MyVerticallyCenteredModal(props) {
    const [maxAmo, setmaxAmo] = useState(0);
    const [otp, setOtp] = useState();
    const [show, setshow] = useState("1");
    const [bAddress, setbAddress] = useState("");
    const [error, seterror] = useState("");
    const [wAddress, setwAddress] = useState("");
    const { address } = useAccount();

    const handleKeyPress = (e) => {
      const charCode = e.which ? e.which : e.keyCode;
      if (charCode < 48 || charCode > 57) {
        e.preventDefault();
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const formData = {
          walletAddress: address,
          amountInUsdt: maxAmo,
        };

        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/buy/referral/claim`,
          formData,
          { withCredentials: true }
        );

        if (data.status === true) {
          toast.success(data.message);
          props.onHide();
          window.location.reload();
        }
      } catch (e) {
        toast.error(e.response.data.message || "Internal server error");
      }
    };

    const handleAddAddress = async (e) => {
      e.preventDefault();

      const formData = {
        walletAddress: wAddress,
      };
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/add/address`,
          formData,
          { withCredentials: true }
        );
        if (res.data.status === true) {
          toast.success(res.data.message);
          setshow("2");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Internal server error");
      }
    };

    const handleSendOtp = async (e) => {
      e.preventDefault();
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
          setshow("3");
          setmaxAmo(totalrefNow);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Internal server error");
      }
    };

    useEffect(() => {
      if (props.show) {
        axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/get/address`, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.status === true) {
              const storedAddress = res.data.data.walletAddress;
              if (!storedAddress) {
                setshow("1");
              }
              if (storedAddress) {
                setbAddress(storedAddress);
                setshow("3");
                setmaxAmo(totalrefNow);
              }
            } else {
              setshow("1");
            }
          })
          .catch((err) => {
            setshow("1");
          });
      } else {
        setshow("1");
        setmaxAmo(0);
        setOtp("");
        setbAddress("");
      }
    }, [props.show, address]);

    const getSubmitHandler = () => {
      if (show === "1") return handleAddAddress;
      if (show === "2") return handleSendOtp;
      return handleSubmit;
    };

    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <div className="container-fluid">
            <form onSubmit={getSubmitHandler()}>
              {show === "3" && (
                <div className="row g-3">
                  <div className="col-12">
                    <label>Wallet Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      disabled
                    />
                  </div>
                  <div className="col-12">
                    <label>Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      value={maxAmo.toFixed(2)}
                      disabled
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">
                      Withdraw
                    </button>
                  </div>
                </div>
              )}

              {show === "1" && (
                <div className="row g-3">
                  <h5 className="text-center">Add Wallet</h5>
                  <div className="col-12 mb-3">
                    <label>Wallet Address</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setwAddress(e.target.value)}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <button
                      type="button"
                      className="w-100 btn btn-primary"
                      onClick={(e) => handleAddAddress(e)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {show === "2" && (
                <div className="row g-3">
                  <h5 className="text-center">Verify OTP</h5>
                  <div className="col-12 mb-3">
                    <label>Verify OTP</label>
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
                  </div>
                  <div className="col-12 mb-3">
                    <button type="submit" className="w-100 btn btn-primary">
                      Verify
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  const totalWaveBuy = history?.reduce((sum, v) => {
    return sum + Number(v.tokenQuantity);
  }, 0);

  const handleClaimAmpunt = async (e) => {
    e.preventDefault();

    try {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/get/address`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.status === true) {
            const storedAddress = res.data.data.walletAddress;
            if (!storedAddress) {
              toast.info("Please add wallet to continue");
              navigate("/add/wallet");
            }
            if (storedAddress) {
              const formData = {
                walletAddress: storedAddress,
                amountInUsdt: totalrefNow,
              };
              axios
                .post(
                  `${process.env.REACT_APP_BACKEND_URL}/buy/referral/claim`,
                  formData,
                  { withCredentials: true }
                )
                .then((res) => {
                  if (res.data.status === true) {
                    toast.success(res.data.message);
                    window.location.reload();
                  }
                })
                .catch((err) => {
                  toast.error(
                    err.response.data.message || "Internal server error"
                  );
                });
            }
          }
        })
        .catch((erro) => {
          toast.error(erro.response.data.message || "Internal server error");
        });
    } catch (error) {
      toast.error(error.response.data.message || "Internal server error");
    }
  };

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
                  : (totalDeCoin / 1000000000000000000).toFixed(2)}{" "}
                Wave
              </h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-container">
              {/* <FontAwesomeIcon icon={faWallet} className="icon" /> */}
              <i className="fa-solid fa-dollar icon"></i>
            </div>
            <div className="stat-info">
              <h3 className="m-0">Total Bought via now payments</h3>
              <h2 className="m-0">
                {totalWaveBuy !== 0 ? totalWaveBuy.toFixed(2) : 0} Wave
              </h2>
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
          <div className="stat-card" style={{ maxWidth: "410px" }}>
            <div className="icon-container">
              {/* <FontAwesomeIcon icon={faCoins} className="icon" /> */}
              <i className="fa-solid fa-coins icon"></i>
            </div>
            <div className="stat-info">
              <h3 className="m-0">Total WAVE Allocated and Vesting</h3>
              <h2 className="m-0">57 M WAVE</h2>
            </div>
          </div>
        </div>

        {/* Presale Participation Section */}
        <div className="presale-section">
          <div className="no-presale">
            <div className="dashboardy">Dashboard</div>
            <h2 className="">No Presale Participation Found</h2>
            <p className="text-black">You haven't participated in any presales yet.</p>
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
              <h2>
                {totalRefList === undefined
                  ? 0
                  : totalRefList / 1000000000000000000}{" "}
                USDT
              </h2>
            </div>
          </div>

          <div className="referral-card">
            <div className="stat-info">
              <h3>Total Earnings Via Now Payments</h3>
              <h2>
                {totalrefNow2 === undefined ? 0 : totalrefNow2.toFixed(2)} USDT
              </h2>
            </div>
          </div>
        </div>

        {/* Referral Link Card */}
        <div className="referral-link-card">
          <h3>Referral Link</h3>
          <div className="link-container">
            <div className="link-box">
              <span className="link-text">{referralLink}</span>
            </div>
            <button className="action-btn copy-btn" onClick={handleCopy}>
              <i className="fa-solid fa-copy"></i>
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Presale Referrals Card */}
        <div className="presale-referrals-card mt-3 mb-3">
          <div className="d-flex justify-content-between">
            <h3>Payment Referrals</h3>
            <div>
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  if (totalrefNow !== 0) {
                    handleClaimAmpunt(e);
                  }
                }}
                disabled={totalrefNow === 0 ? true : false}
              >
                Claim {totalrefNow.toFixed(2)} USDT
              </button>
            </div>
          </div>

          {nowRef?.length === 0 ? (
            <>
              <p>No Referrals Found</p>
            </>
          ) : (
            <>
            <div className="overflow-auto mt-2">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Reward in USDT</th>
                  <th>User spend</th>
                  <th>Payment Type</th>
                  <th>Reward Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                  {nowRef?.map((v, i) => (
                    <tr key={i}>
                      <td>
                        {`${v.forReferral.email.slice(
                      0,
                      3
                    )}***${v.forReferral.email.slice(-12)}`}
                      </td>
                      <td> {v.credit.toFixed(2)} USDT</td>
                      <td>  {(v.credit * 20).toFixed(2)} USDT</td>
                      <td>{v.referralBuyFrom}</td>
                      <td>{v.incomeClaimStatus}</td>
                      <td> {v.incomeClaimStatus === "Completed" ?  <Link onClick={() => {
                      window.open(`${process.env.REACT_APP_BSC_URL}/${v.trxHash}`)
                    }}>Click me</Link> : <></>}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            </div>
              {/* <div className="referrals-table mt-2">
                <div className="table-header">
                  <div className="table-cell phase">User</div>
                  <div className="table-cell bnb">Reward in USDT</div>
                  <div className="table-cell usd">User spend</div>
                  <div className="table-cell usd">Payment Type</div>
                  <div className="table-cell usd">Reward Status</div>
                  <div className="table-cell usd"></div>
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
                    <div className="table-cell usd">{v.referralBuyFrom}</div>
                    <div className="table-cell usd">{v.incomeClaimStatus}</div>
                    <Link onClick={() => {
                      window.open(`${process.env.REACT_APP_BSC_URL}/${v.trxHash}`)
                    }}>Click me</Link>
                  </div>
                ))}
              </div> */}
            </>
          )}
        </div>
        <div className="presale-referrals-card mt-3 mb-3">
          <h5>Transaction History</h5>
          <div className="overflow-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Wave</th>
                  <th>Usdt</th>
                  <th>Transaction Type</th>
                </tr>
              </thead>
              <tbody>
                {vestings?.map((v, i) => (
                  <tr key={i}>
                    <td>Phase {Number(v.phase) + 1}</td>
                    <td>
                      {(
                        Number(v.amountPurchased) / 1000000000000000000
                      ).toFixed(2)}
                    </td>
                    <td>
                      {(Number(v.usdtAmount) / 1000000000000000000).toFixed(2)}
                    </td>
                    <td>Decentralized</td>
                  </tr>
                ))}
                {history &&
                  history?.map((v, i) => (
                    <tr key={i}>
                      <td>{v.phase}</td>
                      <td>{v.tokenQuantity?.toFixed(2)}</td>
                      <td>{v.amount?.toFixed(2)}</td>
                      <td>Centralized</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
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
