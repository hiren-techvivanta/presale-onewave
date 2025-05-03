import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import 'bootstrap/dist/js/bootstrap.min.js';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword';
import Presele from './pages/presele/Presele';
import VerifyOtp from './pages/auth/VerifyOtp';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signin' element={<Login />} />
          <Route path='/signup' element={<Register />} />
          <Route path='/signup/verify/otp' element={<VerifyOtp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/presale' element={<Presele />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

