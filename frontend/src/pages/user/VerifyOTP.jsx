import React, { useState } from "react";
import PublicAPI from "../../api/publicApi";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await PublicAPI.post("verify-otp/", { email, otp });
      toast.success("OTP Verified Successfully!");
      navigate("/user/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.error || "OTP Verification Failed.");
    }
  };

  if (!email) {
    navigate("/user/request-otp");
    return null;
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">Verify OTP</h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          We've sent an OTP to your email. Please enter it below.
        </p>

        <form className="space-y-4" onSubmit={handleVerify}>
          <div>
            <label
              htmlFor="otp"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              One-Time Password
            </label>
            <input
              type="text"
              id="otp"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter OTP"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </section>
  );
};

export default VerifyOTP;
