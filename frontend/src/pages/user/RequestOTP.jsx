import React, { useState } from "react";
import PublicAPI from "../../api/publicApi";
import { useNavigate } from "react-router-dom";

const RequestOTP = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await PublicAPI.post("request-otp/", { email });
      alert("OTP sent: " + res.data.otp);
      navigate("/user/verify-otp", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to request OTP.");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-12 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Request Password Reset</h2>
      <form onSubmit={handleRequestOTP}>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="w-full p-2 bg-blue-600 text-white rounded">Request OTP</button>
      </form>
    </div>
  );
};

export default RequestOTP;
