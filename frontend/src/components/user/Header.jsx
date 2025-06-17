import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/user/login");
  };

  const handleProfile = () => {
    navigate("/user/profile");
  };

  const handleDashboard = () => {
    navigate("/user/dashboard");
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Left side: Dashboard link */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleDashboard}
          className="text-lg font-semibold text-black hover:underline"
        >
          User Dashboard
        </button>
        {/* Optional: dynamic page title */}
        {title && (
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        )}
      </div>

      {/* Right side: Profile and Logout */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleProfile}
          className="text-sm text-gray-700 hover:text-blue-600 transition"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
