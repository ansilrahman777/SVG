import React, { useState } from "react";
import PublicAPI from "../../api/publicApi";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await PublicAPI.post("reset-password/", {
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      alert("Password reset successfully!");
      navigate("/user/login");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reset password.");
    }
  };

  if (!email) {
    navigate("/user/request-otp");
    return null;
  }

  return (
    <div className="p-6 max-w-sm mx-auto mt-12 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-3 p-2 border rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-3 p-2 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="w-full p-2 bg-blue-600 text-white rounded">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
