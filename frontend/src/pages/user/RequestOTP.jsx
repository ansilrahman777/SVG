import React, { useState } from "react";
import PublicAPI from "../../api/publicApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RequestOTP = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await PublicAPI.post("request-otp/", { email });
      toast.success("OTP sent to your email "+ res.data.otp, { autoClose: 2000 });
      navigate("/user/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to request OTP.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Forgot Password?
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your registered email to receive a verification OTP.
        </p>

        <form className="space-y-4" onSubmit={handleRequestOTP}>
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
          >
            Send OTP
          </button>
        </form>
      </div>
    </section>
  );
};

export default RequestOTP;
