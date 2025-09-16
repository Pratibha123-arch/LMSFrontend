import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const { verifyOtp } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      setMessage("Please enter both email and OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await verifyOtp(email, otp); 
      if (res?.data) {
        setMessage("OTP Verified! Logged in successfully");
        navigate("/"); 
      }
    } catch (err) {
      console.error(err);
      setMessage(err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-3"
      />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-3"
      />
      <button
        onClick={handleVerifyOtp}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      {message && <p className="mt-3 text-red-500">{message}</p>}
    </div>
  );
};

export default VerifyOtp;
