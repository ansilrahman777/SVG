import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import CommentHistoryModal from "../../components/admin/CommentHistoryModal";
import Pagination from "../../components/Pagination";
import { toast } from "react-toastify";

const AdminAllCommentHistories = () => {
  const [histories, setHistories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [modalData, setModalData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllHistories();
  }, []);

  const fetchAllHistories = async () => {
    try {
      const res = await API.get("adminpanel/admin-all-comment-histories/");
      setHistories(res.data);
    } catch (err) {
      console.error("Failed to fetch all histories", err);
      toast.error("Failed to load comment history records.", { autoClose: 2000 });
    }
  };

  const grouped = histories.reduce((acc, item, index) => {
    const isDeleted = !item.comment_id;
    const key = isDeleted
      ? `deleted-${item.modified_by_email}-${item.modified_at || index}`
      : item.comment_id;

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const groupedEntries = Object.entries(grouped);
  const totalPages = Math.ceil(groupedEntries.length / ITEMS_PER_PAGE);
  const currentPageEntries = groupedEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-auto">
        <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Latest Comment Actions</h2>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              ← Back
            </button>
          </div>

          {groupedEntries.length === 0 ? (
            <p className="text-gray-500 italic">No comment history available.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPageEntries.map(([commentId, records]) => {
                  const sorted = [...records].sort(
                    (a, b) => new Date(b.modified_at) - new Date(a.modified_at)
                  );
                  const latest = sorted[0];
                  const showMoreKey = `${commentId}-latest`;

                  return (
                    <div
                      key={commentId}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition duration-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        🛠 {latest.action.charAt(0).toUpperCase() + latest.action.slice(1)} Comment
                      </h3>

                      <div className="text-xs text-gray-600 mb-1">
                        {latest.modified_by_email} —{" "}
                        {new Date(latest.modified_at).toLocaleString()}
                      </div>

                      {latest.old_text && (
                        <div className="text-xs text-red-500 mb-1">
                          <strong>➤ Old:</strong>{" "}
                          <span className={expandedCards[showMoreKey] ? "" : "line-clamp-2"}>
                            {latest.old_text}
                          </span>
                        </div>
                      )}

                      {latest.new_text && (
                        <div className="text-xs text-green-600 mb-2">
                          <strong>➤ New:</strong>{" "}
                          <span className={expandedCards[showMoreKey] ? "" : "line-clamp-2"}>
                            {latest.new_text}
                          </span>
                        </div>
                      )}

                      {(latest.old_text?.length > 100 || latest.new_text?.length > 100) && (
                        <button
                          className="text-blue-500 text-xs hover:underline"
                          onClick={() =>
                            setExpandedCards((prev) => ({
                              ...prev,
                              [showMoreKey]: !prev[showMoreKey],
                            }))
                          }
                        >
                          {expandedCards[showMoreKey] ? "Show Less" : "Show More"}
                        </button>
                      )}

                      {records.length > 1 && (
                        <button
                          className="mt-3 ml-2 text-blue-600 text-xs hover:underline"
                          onClick={() => setModalData(records)}
                        >
                          View Full History
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      <CommentHistoryModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        history={modalData}
      />
    </div>
  );
};

export default AdminAllCommentHistories;
