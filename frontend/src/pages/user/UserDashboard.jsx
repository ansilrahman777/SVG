import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/userAPI";
import PageCard from "../../components/PageCard"; // Adjust the path as needed
import UserHeader from "../../components/user/Header"; // Optional: reusable header
import { toast } from "react-toastify";

const bgColors = [
  "bg-orange-500",
  "bg-teal-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-indigo-500",
];

const UserDashboard = () => {
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  const fetchPages = async () => {
    try {
      const res = await API.get("accounts/my-pages/");
      setPages(res.data);
    } catch (err) {
      console.error("Failed to fetch pages", err);
      toast.error("Failed to fetch pages.", { autoClose: 2000 });
      
    }
  };

  const handlePageClick = (pageKey) => {
    navigate(`/user/page/${pageKey}`);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Reusable header */}
      <UserHeader />

      <main className="flex-grow p-6 max-w-7xl mx-auto animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Pages</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pages.map((page, index) => {
            const color = bgColors[index % bgColors.length];
            const label = page.page_label;
            const count = 
              [page.can_view, page.can_create, page.can_edit, page.can_delete].filter(Boolean)
                .length || 0;

            return (
              <PageCard
                key={label}
                pageLabel={label}
                color={color}
                onClick={() => handlePageClick(page.page_key)}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
