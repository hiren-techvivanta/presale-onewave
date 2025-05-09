import React from 'react'
import ani from '../../assets/json/Error.json'
import Lottie from "lottie-react";
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
   <main class="page-wrapper">
      <div class="container d-flex flex-column justify-content-center min-vh-100 py-5">
        <Lottie  animationData={ani} class="d-dark-mode-none mt-n5 bg-transparent"  speed="1" loop autoplay />
        {/* <lottie-player class="d-none d-dark-mode-block mt-n5" src="assets/json/animation-404-dark.json" background="transparent" speed="1" loop autoplay></lottie-player> */}
        <div class="text-center pt-4 mt-lg-1">
          <h1 class="display-5">Page not found</h1>
          <p class="fs-lg pb-2 pb-md-0 mb-4 mb-md-4">The page you are looking for was moved, removed or might never existed.</p>
          <Link class="btn btn-lg btn-primary" to="/dashboard">Go to Dashboard</Link>
        </div>
      </div>
    </main>
  )
}

export default Error404