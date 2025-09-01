import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const ResendOtp = () => {
  const { resendOtp } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    try {
      const res = await resendOtp(email);
      setMessage(`OTP resent via ${res.deliveryMethod}`);
    } catch (err) {
      setMessage(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={handleResend}>Resend OTP</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResendOtp;
