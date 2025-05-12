import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import "bootstrap/dist/js/bootstrap.min.js";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Presele from "./pages/presele/Presele";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Dashboard from "./pages/dashboard/Dashboard";
import Investments from "./pages/investment/Investments";
import CentralizedInvestment from "./pages/investment/CentralizedInvestment";
import ResetPassword from "./pages/auth/ResetPassword";
import Error404 from "./pages/error/Error404";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import WavePresale from "./pages/investment/Decentralizedinvestment";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/signup/:refCode" element={<Register />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/signup/verify/otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/presale" element={<Presele />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/investment/centralized"
            element={<CentralizedInvestment />}
          />
          <Route path="/investment/decentralized" element={<WavePresale />} />
          {/* <Route path="/investment/decentralized" element={<Investments />} /> */}

          <Route
            path="/investment/decentralized/:ref"
            element={<WavePresale />}
          />
          <Route
            path="/terms"
            element={<TermsOfService />}
          />

          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
