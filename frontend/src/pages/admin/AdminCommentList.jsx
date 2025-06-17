import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import CommentModal from "../../components/CommentModal";
import CommentHistoryModal from "../../components/admin/CommentHistoryModal";
import Pagination from "../../components/Pagination";
import { toast } from "react-toastify";

const AdminCommentList = () => {
  const { pageLabelParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const PAGE_CODES = {
    "Products List": "products_list",
    "Marketing List": "marketing_list",
    "Order List": "order_list",
    "Media Plans": "media_plans",
    "Offer Pricing SKUs": "offer_pricing_skus",
    "Clients": "clients",
    "Suppliers": "suppliers",
    "Customer Support": "customer_support",
    "Sales Reports": "sales_reports",
    "Finance & Accounting": "finance_accounting",
  };

  const decodedPageLabelParam = decodeURIComponent(pageLabelParam || "").trim();
  const pageLabel = location.state?.pageLabel || decodedPageLabelParam;
  const pageCode = location.state?.pageCode || PAGE_CODES[pageLabel] || "";

  const [comments, setComments] = useState([]);
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, comment: null });
  const [historyModalData, setHistoryModalData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState({});

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    if (!pageLabel) navigate("/adminpanel/comments");
  }, [pageLabel, navigate]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await API.get("adminpanel/admin-comments/");
      setComments(res.data[pageLabel] || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch comments.", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistories = async () => {
    try {
      const res = await API.get("adminpanel/admin-all-comment-histories/");
      setHistories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch comment histories.", { autoClose: 2000 });
    }
  };

  useEffect(() => {
    if (pageLabel) {
      fetchComments();
      fetchHistories();
    }
  }, [pageLabel]);

  const handleAddComment = async (text) => {
    if (!pageCode) {
      toast.error("Invalid page code. Cannot submit comment.", { autoClose: 2000 });
      return;
    }
    try {
      await API.post("adminpanel/admin-comments-create/", {
        page: pageCode,
        text,
      });
      setShowAddModal(false);
      fetchComments();
      toast.success("Comment added successfully!", { autoClose: 2000 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment.", { autoClose: 2000 });
    }
  };

  const handleEditComment = async (text) => {
    try {
      await API.patch(`adminpanel/admin-comments/${editModal.comment.id}/`, {
        text,
      });
      setEditModal({ open: false, comment: null });
      fetchComments();
      toast.success("Comment updated successfully!", { autoClose: 2000 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update comment.", { autoClose: 2000 });
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await API.delete(`adminpanel/admin-comments/${id}/`);
      fetchComments();
      toast.success("Comment deleted successfully!", { autoClose: 2000 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment.", { autoClose: 2000 });
    }
  };

  const groupedHistories = histories.reduce((acc, item) => {
    if (!item.comment_id) return acc;
    if (!acc[item.comment_id]) acc[item.comment_id] = [];
    acc[item.comment_id].push(item);
    return acc;
  }, {});

  const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);
  const paginatedComments = comments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!pageLabel) return null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-auto">
        <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="p-4 md:p-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">{pageLabel} — Comments</h2>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded shadow transition"
              onClick={() => setShowAddModal(true)}
            >
              + Add Comment
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading comments...</p>
          ) : paginatedComments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedComments.map((comment) => {
                  const isLong = comment.text.length > 100;
                  const showMoreKey = `comment-${comment.id}`;
                  const expanded = expandedCards[showMoreKey];

                  return (
                    <div
                      key={comment.id}
                      className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-blue-400 transition duration-300 w-[300px] h-[230px] flex flex-col justify-between"
                    >
                      <div className="text-sm font-semibold text-gray-800 mb-2 truncate">{comment.user_email}</div>

                      <div className="text-gray-700 text-sm mb-2">
                        <span className={expanded ? "" : "line-clamp-3"}>{comment.text}</span>
                        {isLong && (
                          <button
                            onClick={() =>
                              setExpandedCards((prev) => ({
                                ...prev,
                                [showMoreKey]: !prev[showMoreKey],
                              }))
                            }
                            className="text-blue-500 text-xs ml-1 hover:underline"
                          >
                            {expanded ? "Show Less" : "Show More"}
                          </button>
                        )}
                      </div>

                      <div className="text-xs text-gray-400 italic mb-2">
                        {new Date(comment.created_at).toLocaleString()}
                      </div>

                      <div className="flex justify-between items-center gap-2 mt-auto">
                        <button
                          onClick={() => setEditModal({ open: true, comment })}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-md"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md"
                        >
                          🗑 Delete
                        </button>
                        {groupedHistories[comment.id]?.length > 0 && (
                          <button
                            onClick={() => setHistoryModalData(groupedHistories[comment.id])}
                            className="text-blue-600 text-xs hover:underline"
                          >
                            📜 {groupedHistories[comment.id].length}
                          </button>
                        )}
                      </div>
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

      <CommentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddComment}
        title={`Add Comment to ${pageLabel}`}
        submitLabel="Add Comment"
      />

      <CommentModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, comment: null })}
        onSubmit={handleEditComment}
        initialText={editModal.comment?.text || ""}
        title="Edit Comment"
        submitLabel="Save Changes"
      />

      <CommentHistoryModal
        isOpen={!!historyModalData}
        onClose={() => setHistoryModalData(null)}
        history={historyModalData}
      />
    </div>
  );
};

export default AdminCommentList;
