import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Escape key support
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter an email");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("adminpanel/create-user/", { email });
      onUserAdded(response.data);
      setEmail("");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to add user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative transform transition-all duration-300 ease-out scale-100 opacity-100 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Add New User
          </h2>

          {error && (
            <p className="text-sm text-red-600 bg-red-100 rounded p-2 mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition"
              >
                {loading ? "Adding..." : "Add User"}
              </button>
            </div>
          </form>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
};

export default AddUserModal;
