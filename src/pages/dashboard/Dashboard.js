// import React, { useState } from "react";
// import { Button } from "react-bootstrap";
// import Sidebar from "../../components/Sidebar";

// const Dashboard = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarCollapsed(!sidebarCollapsed);
//   };
//   return (
//     <>
//       <main class="page-wrapper">
//         <div class="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5">
//           <div class="row pt-sm-2 pt-lg-0">
//             <Sidebar
//               collapsed={sidebarCollapsed}
//               toggleSidebar={toggleSidebar}
//             />

//             <div class="col-lg-9 pt-4 pb-2 pb-sm-4">
//               <h1 class="h2 mb-4">Overview</h1>

//               <div class="card border-0  shadow py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
//                 <div class="card-body p-3">
//                   <div class="row g-3 g-xl-4">
//                     <div class="col-md-4 col-sm-6">
//                       <div class="h-100 bg-secondary rounded-3 text-center p-4">
//                         <h2 class="h6 pb-2 mb-1">Earnings (before taxes)</h2>
//                         <div class="h2 text-primary mb-2">$842.00</div>
//                         <p class="fs-sm text-body-secondary mb-0">
//                           Sales 8/1/2023 - 8/15/2023
//                         </p>
//                       </div>
//                     </div>
//                     <div class="col-md-4 col-sm-6">
//                       <div class="h-100 bg-secondary rounded-3 text-center p-4">
//                         <h2 class="h6 pb-2 mb-1">Your balance</h2>
//                         <div class="h2 text-primary mb-2">$735.00</div>
//                         <p class="fs-sm text-body-secondary mb-0">
//                           To be paid on 8/15/2023
//                         </p>
//                       </div>
//                     </div>
//                     <div class="col-md-4 col-sm-12">
//                       <div class="h-100 bg-secondary rounded-3 text-center p-4">
//                         <h2 class="h6 pb-2 mb-1">Lifetime earnings</h2>
//                         <div class="h2 text-primary mb-2">$9,156.74</div>
//                         <p class="fs-sm text-body-secondary mb-0">
//                           Based on list price
//                         </p>
//                       </div>
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

// export default Dashboard;

import { useEffect, useState } from 'react';
import Topnav from '../../components/Topnav'
import './dashboard.scss';

const Dashboard = () => {
  const [copied, setCopied] = useState(false);
  const [referralLink, setreferralLink] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("user")
    const parsedObject = JSON.parse(user);
    const objectArray = [parsedObject];
    setreferralLink(`${process.env.REACT_APP_PROJECT_URL}/signup/${objectArray[0]?._id}`)

  }, [])
  
  // const referralLink = `${process.env.REACT_APP_PROJECT_URL}/signup/`
  //  "https://onewave.app/presale?referral=0x3Af5783057A282028549dad4031640941A1A2194";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <i class="fa-solid fa-receipt icon"></i>
            </div>
            <div className="stat-info">
              <h3 className='m-0'>Total Bought in USD</h3>
              <h2 className='m-0'>0.00 USD</h2>
            </div>
          </div>
          
          <div className="stat-card" style={{maxWidth:"410px"}}>
            <div className="icon-container">
              {/* <FontAwesomeIcon icon={faCoins} className="icon" /> */}
              <i class="fa-solid fa-coins icon"></i>
            </div>
            <div className="stat-info">
              <h3 className='m-0'>Total WAVE Allocated and Vesting</h3>
              <h2 className='m-0'>2.300cr. WAVE</h2>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="icon-container">
              {/* <FontAwesomeIcon icon={faChartLine} className="icon" /> */}
              <i class="fa-solid fa-hexagon-nodes icon"></i>
            </div>
            <div className="stat-info">
              <h3 className='m-0'>Total Vested</h3>
              <h2 className='m-0'>0.000 WAVE</h2>
            </div>
          </div>
        </div>
        
        {/* Presale Participation Section */}
        <div className="presale-section">
          <div className="no-presale">
          <div class="dashboardy">Dashboard</div>
            <h2 className='text-white'>No Presale Participation Found</h2>
            <p>You haven't participated in any presales yet.</p>
            <button className="buy-wave-btn">Buy WAVE</button>
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
              <i className='fa-solid fa-copy'></i>
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button className="action-btn share-btn" onClick={handleCopy}>
              {/* <FontAwesomeIcon icon={faShareNodes} /> */}
              <i className='fa-solid fa-share-nodes'></i>
              <span>Share</span>
            </button>
          </div>
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