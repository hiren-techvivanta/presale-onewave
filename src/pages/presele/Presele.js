import React, { useEffect, useState } from "react";
import Topnav from "../../components/Topnav";

import i1 from "../../assets/images/aemethish.png";
import i2 from "../../assets/images/emrald.png";
import i3 from "../../assets/images/iron.png";
import i4 from "../../assets/images/ore.png";
import i5 from "../../assets/images/ruby.png";
import i6 from "../../assets/images/capsule.png";
import i7 from "../../assets/images/stare.png";
import i8 from "../../assets/images/dimoand.png";
import i9 from "../../assets/images/gold.png";
import i10 from "../../assets/images/lapis.png";
import i11 from "../../assets/images/wave.png";
import i12 from "../../assets/images/bluejems.png";
import i13 from "../../assets/images/bluestone.png";

import { useAppKit } from "@reown/appkit/react";
import { Modal } from "react-bootstrap";
import contractAbi from "../../assets/json/abi.json";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";

const Presele = () => {
  const [modalShow, setModalShow] = useState(false);
  const [wco, setwco] = useState(false);
  const [phases, setphase] = useState("");
  const [conStart, setconStart] = useState(false)

  const { open, close } = useAppKit();
  const { isConnected, address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  useEffect(() => {
    if (isConnected) {
      console.log("Connected Address:", address);
      setwco(true);
    } else {
      setwco(false);
    }

    if (conStart === true && isConnected) {
      setModalShow(true)
    }

  }, [isConnected,conStart]);

  // Modal for purchase
  function MyVerticallyCenteredModal(props) {
    const [showInput, setshowInput] = useState(false);
    const [amounts, setAmounts] = useState("");

    useEffect(() => {
      if (conStart === true && isConnected) {
        setshowInput(true)
      }
    }, [conStart,isConnected])
    
    const checkStatus = () => {
      if (!wco) {
        open();
        setconStart(true)
        setModalShow(false);
      } else {
        setshowInput(true);
      }
    };

    const handlePurchase = async () => {
      try {
        setModalShow(false)
        const usdtAmount = parseUnits(amounts, 18);
        const phase = +phases;
        const referrer = "0x0000000000000000000000000000000000000000";

        const tx = await writeContractAsync({
          abi: contractAbi,
          address: process.env.REACT_APP_SMART_CONTRACT,
          functionName: "purchaseTokens",
          args: [phase, usdtAmount, referrer],
        });

        console.log("Transaction hash:", tx.hash);
      } catch (error) {
        console.error("Purchase failed:", error);
      }
    };

    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="py-4">
          {showInput && (
            <>
              <div>
                <p className="text-center fw-semibold text-secondary">
                  Enter amount to continue purchase
                </p>
               <div className="pt-3">
               <label htmlFor="" className="form-label">
                  Amount
                </label>
                <input
                  type="number"
                  className="form-control w-100 rounded-2"
                  placeholder="Enter Amount"
                  onChange={(e) => setAmounts(e.target.value)}
                />
               </div>
               <div className="d-flex justify-content-center pt-3 gap-3">
               <button
                  className="btn btn-primary px-4 py-2 rounded-3"
                  onClick={handlePurchase}
                >
                  Buy Now
                </button>
                <button
                  className="btn btn-secondary px-4 py-2 rounded-3"
                  onClick={() => setshowInput(false)}
                >
                  Cancle
                </button>
               </div>
              </div>
            </>
          )}
          {!showInput && (
            <div>
              <p className="text-center fw-semibold text-secondary">
                Choose option to continue purchase
              </p>
              <div className="d-flex justify-content-center align-items-center gap-3">
                <div>
                  <button
                    className="btn btn-primary py-3 px-4 fw-semibold rounded-3"
                    onClick={checkStatus}
                  >
                    Connect Wallet
                  </button>
                </div>
                <div className="d-flex flex-column">
                  <hr
                    className="w-100"
                    style={{ transform: "rotate(90deg)" }}
                  />
                  <p className="m-0">or</p>
                  <hr
                    className="w-100"
                    style={{ transform: "rotate(90deg)" }}
                  />
                </div>
                <div>
                  <button className="btn btn-primary py-3 px-4 fw-semibold rounded-3">
                    Scan QR Code
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <div className="main-liner main-bg-img vh-100">
        <Topnav />

        {/* images */}
        <img src={i1} className="floating-asset asset1" alt="i1" />
        <img src={i2} className="floating-asset asset2" alt="i1" />
        <img src={i3} className="floating-asset asset3" alt="i1" />
        <img src={i4} className="floating-asset asset4" alt="i1" />
        <img src={i5} className="floating-asset asset5" alt="i1" />
        <img src={i6} className="floating-asset asset6" alt="i1" />
        <img src={i7} className="floating-asset asset7" alt="i1" />
        <img src={i8} className="floating-asset asset8" alt="i1" />
        <img src={i9} className="floating-asset asset9" alt="i1" />
        <img src={i10} className="floating-asset asset10" alt="i1" />
        <img src={i11} className="floating-asset asset11" alt="i1" />
        <img src={i12} className="floating-asset asset12" alt="i1" />
        <img src={i13} className="floating-asset asset13" alt="i1" />
        <div className="container">
          <h1
            className="text-center text-white"
            style={{
              paddingTop: "7rem",
              fontWeight: "700",
              textShadow: "0 0.4rem 0.15rem rgb(55 59 62 / 30%)",
            }}
          >
            World's First Real World Assets (RWA)
          </h1>
          <h1
            className="text-center text-white"
            style={{
              fontWeight: "700",
              textShadow: "0 0.4rem 0.15rem rgb(55 59 62 / 30%)",
            }}
          >
            Backed Presale
          </h1>
          <p
            className="text-center text-white"
            style={{
              fontSize: "1.1rem",
              textShadow: "0 0.25rem 0.15rem rgb(55 59 62 / 50%)",
            }}
          >
            OneWave Presale sets a new benchmark in crypto—backed by real-world
            assets <br /> like gold, silver, and certified gems for unmatched
            trust and value
          </p>

          <div className="container-fluid  pt-5 z-0">
            <div className="row gx-4 justify-content-center">
              {/* <!-- Repeat for each presale card --> */}
              <div className="col-md-6 col-lg-3 mb-4">
                <div className="presale-card position-relative bg-white rounded-4 shadow-sm p-3">
                  <h4 className="fw-bold mb-4">Presale Phase 1</h4>
                  <hr className="" />
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Price</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    {/* dynamic spacer */}
                    <span className="value">$0.2</span>
                  </div>
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Cliff</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    {/* dynamic spacer */}
                    <span className="value">12 Months</span>
                  </div>
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Vesting</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    {/* dynamic spacer */}
                    <span className="value">5% X 20 Months</span>
                  </div>
                  <div className="text-center pt-3">
                    <button
                      className="btn btn-primary w-100 fw-bold"
                      // onClick={open}
                      onClick={() => {
                        setphase("1");
                        setModalShow(true);
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-4">
                <div className="presale-card position-relative bg-white rounded-4 shadow-sm p-3">
                  <h4 className="fw-bold mb-4">Presale Phase 2</h4>
                  <hr className="" />
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Price</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    <span className="value">$0.4</span>
                  </div>
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Cliff</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    <span className="value">9 Months</span>
                  </div>
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Vesting</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    <span className="value">5% X 20 Months</span>
                  </div>
                  <div className="text-center pt-3">
                    <button
                      className="btn btn-primary w-100 fw-bold"
                      onClick={() => {
                        setphase("2");
                        setModalShow(true);
                      }}
                      // disabled
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-4">
                <div className="presale-card position-relative bg-white rounded-4 shadow-sm p-3">
                  <h4 className="fw-bold mb-4">Presale Phase 3</h4>
                  <hr className="" />
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Price</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    <span className="value">$0.6</span>
                  </div>
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Cliff</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    <span className="value">6 Months</span>
                  </div>
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Vesting</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    <span className="value">5% X 20 Months</span>
                  </div>
                  <div className="text-center pt-3">
                    <button
                      className="btn btn-primary w-100 fw-bold"
                      onClick={() => {
                        setphase("3");
                        setModalShow(true);
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mb-4">
                <div className="presale-card position-relative bg-white rounded-4 shadow-sm p-3">
                  <h4 className="fw-bold mb-4">Presale Phase 4</h4>
                  <hr className="" />
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Price</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    <span className="value">$0.8</span>
                  </div>
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Cliff</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    <span className="value">3 Months</span>
                  </div>
                  <div className="info-row d-flex py-2">
                    <span className="label me-auto">Vesting</span>
                    <div className="flex-grow-1 mx-2 dor-range"></div>{" "}
                    <span className="value">5% X 20 Months</span>
                  </div>
                  <div className="text-center pt-3">
                    <button
                      className="btn btn-primary w-100 fw-bold"
                      onClick={() => {
                        setphase("4");
                        setModalShow(true);
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default Presele;
