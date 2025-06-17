import React, { useState } from "react";
import PublicAPI from "../../api/publicApi";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

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
      toast.success("Password reset successfully!");
      navigate("/user/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset password.");
    }
  };

  if (!email) {
    navigate("/user/request-otp");
    return null;
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">Reset Password</h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter and confirm your new password below.
        </p>

        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label
              htmlFor="new-password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
