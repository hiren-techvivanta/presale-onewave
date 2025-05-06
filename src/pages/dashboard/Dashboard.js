import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  return (
    <>
      <main class="page-wrapper">
        <div class="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5">
          <div class="row pt-sm-2 pt-lg-0">
            <Sidebar
              collapsed={sidebarCollapsed}
              toggleSidebar={toggleSidebar}
            />

            <div class="col-lg-9 pt-4 pb-2 pb-sm-4">
              <h1 class="h2 mb-4">Overview</h1>

              <div class="card border-0  shadow py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div class="card-body p-3">
                  <div class="row g-3 g-xl-4">
                    <div class="col-md-4 col-sm-6">
                      <div class="h-100 bg-secondary rounded-3 text-center p-4">
                        <h2 class="h6 pb-2 mb-1">Earnings (before taxes)</h2>
                        <div class="h2 text-primary mb-2">$842.00</div>
                        <p class="fs-sm text-body-secondary mb-0">
                          Sales 8/1/2023 - 8/15/2023
                        </p>
                      </div>
                    </div>
                    <div class="col-md-4 col-sm-6">
                      <div class="h-100 bg-secondary rounded-3 text-center p-4">
                        <h2 class="h6 pb-2 mb-1">Your balance</h2>
                        <div class="h2 text-primary mb-2">$735.00</div>
                        <p class="fs-sm text-body-secondary mb-0">
                          To be paid on 8/15/2023
                        </p>
                      </div>
                    </div>
                    <div class="col-md-4 col-sm-12">
                      <div class="h-100 bg-secondary rounded-3 text-center p-4">
                        <h2 class="h6 pb-2 mb-1">Lifetime earnings</h2>
                        <div class="h2 text-primary mb-2">$9,156.74</div>
                        <p class="fs-sm text-body-secondary mb-0">
                          Based on list price
                        </p>
                      </div>
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

export default Dashboard;
