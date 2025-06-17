import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    dob: "",
  });

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await API.get("accounts/profile/");
      setProfile(res.data);
    } catch (err) {
      alert("Failed to load profile.");
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
    try {
      await API.put("accounts/profile/", profile);
      alert("Profile updated successfully!");
      navigate("/user/dashboard");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center bg-blue-600 p-4 text-white">
        <h1 className="text-xl font-bold">Profile</h1>
        <button
          onClick={() => navigate("/user/dashboard")}
          className="bg-white text-blue-600 px-3 py-1 rounded"
        >
          Back to Dashboard
        </button>
      </header>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="p-6 max-w-md mx-auto mt-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={profile.first_name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={profile.last_name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={profile.mobile}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={profile.dob}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <button className="w-full p-2 bg-blue-600 text-white rounded">Save Changes</button>
      </form>
    </div>
  );
};

export default UserProfile;
