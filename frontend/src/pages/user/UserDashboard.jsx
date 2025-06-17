import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  const fetchPages = async () => {
    try {
      const res = await API.get("accounts/my-pages/");
      setPages(res.data);
    } catch (err) {
      alert("Failed to fetch pages.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/user/login");
  };

  const handlePageClick = (page_key) => {
    navigate(`/user/page/${page_key}`);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className="p-6">
      <header className="flex justify-between items-center bg-blue-600 p-4 text-white">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </header>

      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Accessible Pages</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {pages.map((page, index) => (
            <div
              key={page.page_key || index}
              onClick={() => handlePageClick(page.page_key)}
              className="p-4 border rounded shadow cursor-pointer hover:bg-blue-50 transition"
            >
              <h3 className="text-lg font-bold mb-2">{page.page_label}</h3>

              <div className="text-sm text-gray-700">
                Access:
                {page.can_view && <span className="ml-2">View</span>}
                {page.can_create && <span className="ml-2">Create</span>}
                {page.can_edit && <span className="ml-2">Edit</span>}
                {page.can_delete && <span className="ml-2">Delete</span>}
                {!page.can_view &&
                  !page.can_create &&
                  !page.can_edit &&
                  !page.can_delete && (
                    <span className="ml-2 text-gray-400">No Access</span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
