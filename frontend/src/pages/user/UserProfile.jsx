import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/user/Header"; // Adjust the path if needed
import { toast } from "react-toastify";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get("accounts/profile/");
      setProfile(res.data);
    } catch {
      toast.error("Failed to load profile.", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put("accounts/profile/", profile);
      toast.success("Profile updated successfully!", { autoClose: 2000 });
      navigate("/user/dashboard");
    } catch {
      toast.error("Failed to update profile.", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow flex justify-center items-start p-6">
        <form
          onSubmit={handleSave}
          className="bg-white rounded-md border-md shadow-md max-w-md w-full p-6
            animate-fadeIn"
          style={{ animationDuration: "400ms", animationTimingFunction: "ease-out" }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Edit Profile
          </h2>

          <label className="block mb-4">
            <span className="text-gray-700 text-sm mb-1 block">First Name</span>
            <input
              type="text"
              name="first_name"
              value={profile.first_name}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2
                focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 text-sm mb-1 block">Last Name</span>
            <input
              type="text"
              name="last_name"
              value={profile.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2
                focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 text-sm mb-1 block">Mobile</span>
            <input
              type="tel"
              name="mobile"
              value={profile.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="w-full border border-gray-300 rounded px-3 py-2
                focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 text-sm mb-1 block">Date of Birth</span>
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2
                focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded
              font-semibold hover:bg-blue-700 transition
              ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        .animate-fadeIn {
          animation-name: fadeIn;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
