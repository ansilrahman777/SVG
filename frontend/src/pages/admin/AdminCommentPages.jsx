import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";

// Color palette to rotate between cards
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
      alert("Failed to load comments.");
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
                <div
                  key={pageLabel}
                  className={`relative overflow-hidden ${color} rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer h-[260px] flex flex-col justify-between`}
                  onClick={() =>
                    navigate(`/adminpanel/comments/${encodeURIComponent(pageLabel)}`, {
                      state: { pageLabel, pageCode: comments[0]?.page || "" },
                    })
                  }
                >
                  {/* Background SVGs */}
                  <svg
                    className="absolute bottom-0 left-0 mb-8"
                    viewBox="0 0 375 283"
                    fill="none"
                    style={{ transform: "scale(1.5)", opacity: 0.1 }}
                  >
                    <rect
                      x="159.52"
                      y="175"
                      width="152"
                      height="152"
                      rx="8"
                      transform="rotate(-45 159.52 175)"
                      fill="white"
                    />
                    <rect
                      y="107.48"
                      width="152"
                      height="152"
                      rx="8"
                      transform="rotate(-45 0 107.48)"
                      fill="white"
                    />
                  </svg>

                  {/* Title */}
                  <div className="relative pt-10 px-6 text-center">
                    <h3 className="text-white font-semibold text-lg leading-tight truncate">
                      {pageLabel}
                    </h3>
                  </div>

                  {/* Comment Count */}
                  <div className="relative text-white px-6 pb-6">
                    <p className="text-sm opacity-75 mb-2 text-center">Total Comments</p>
                    <div className="flex justify-center">
                      <span className="bg-white text-gray-800 rounded-full text-sm font-semibold px-4 py-1">
                        {comments.length}
                      </span>
                    </div>
                  </div>
                </div>

              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminCommentPages;
