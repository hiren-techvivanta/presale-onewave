import React, { useEffect, useState } from "react";

const CountdownCard = () => {
  const targetDate = new Date("2026-01-01T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - new Date().getTime());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setIsVisible(false); // Hide card
      } else {
        setTimeLeft(distance);
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup
  }, []);

  if (!isVisible) return null;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div
      className="position-absolute timer  mt-5 p-3 px-4 rounded-4 shadow"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        color: "#fff",
        zIndex: 10,
        border: "1px solid rgba(255, 255, 255, 0.2)",
        fontFamily: "'Segoe UI', sans-serif",
        fontWeight: 500,
      }}
    >
      <h5 className="mb-2 text-center text-uppercase">We Are Listing In</h5>
      <div
        className="d-flex justify-content-center gap-3 fs-5"
        style={{ letterSpacing: "1px" }}
      >
        <div>
          <strong>{days}</strong> <small>Days</small>
        </div>
        <div>
          <strong>{hours}</strong> <small>Hours</small>
        </div>
        <div>
          <strong>{minutes}</strong> <small>Mins</small>
        </div>
        <div>
          <strong>{seconds}</strong> <small>Secs</small>
        </div>
      </div>
    </div>
  );
};

export default CountdownCard;
