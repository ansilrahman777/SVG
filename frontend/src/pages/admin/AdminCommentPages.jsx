import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import PageCard from "../../components/PageCard"; // ✅ Import reusable PageCard
import { toast } from "react-toastify";

const bgColors = [
  "bg-orange-500",
  "bg-teal-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-indigo-500",
];

const AdminCommentPages = () => {
  const [pageComments, setPageComments] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await API.get("adminpanel/admin-comments/");
      setPageComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
      toast.error("Failed to load comments.", { autoClose: 2000 });
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleCardClick = (pageLabel, pageCode) => {
    navigate(`/adminpanel/comments/${encodeURIComponent(pageLabel)}`, {
      state: { pageLabel, pageCode },
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-auto">
        <AdminNavbar toggleSidebar={toggleSidebar} />

        <div className="p-4 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Comments by Page</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Object.entries(pageComments).map(([pageLabel, comments], index) => {
              const color = bgColors[index % bgColors.length];
              return (
                <PageCard
                  key={pageLabel}
                  pageLabel={pageLabel}
                  count={comments.length}
                  color={color}
                  onClick={() => handleCardClick(pageLabel, comments[0]?.page || "")}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCommentPages;
