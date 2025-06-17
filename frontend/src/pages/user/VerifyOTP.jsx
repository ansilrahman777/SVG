import React, { useState } from "react";
import PublicAPI from "../../api/publicApi";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await PublicAPI.post("verify-otp/", { email, otp });
      alert("OTP Verified Successfully!");
      navigate("/user/reset-password", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.error || "OTP Verification Failed.");
    }
  };

  if (!email) {
    navigate("/user/request-otp");
    return null;
  }

  return (
    <div className="p-6 max-w-sm mx-auto mt-12 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full mb-3 p-2 border rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button className="w-full p-2 bg-blue-600 text-white rounded">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOTP;
