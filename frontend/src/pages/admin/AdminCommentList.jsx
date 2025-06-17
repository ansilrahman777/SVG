import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import CommentModal from "../../components/CommentModal";

const AdminCommentList = () => {
  const { pageLabelParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const pageLabel = location.state?.pageLabel || decodeURIComponent(pageLabelParam || "");
  const pageCode = location.state?.pageCode || "";

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, comment: null });

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
      alert("Failed to fetch comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageLabel) fetchComments();
  }, [pageLabel]);

  const handleAddComment = async (text) => {
    try {
      await API.post("adminpanel/admin-comments-create/", {
        page: pageCode,
        text,
      });
      setShowAddModal(false);
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Failed to add comment.");
    }
  };

  const handleEditComment = async (text) => {
    try {
      await API.patch(`adminpanel/admin-comments/${editModal.comment.id}/`, {
        text,
      });
      setEditModal({ open: false, comment: null });
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Failed to update comment.");
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await API.delete(`adminpanel/admin-comments/${id}/`);
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment.");
    }
  };

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
          ) : comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-xs text-gray-500 italic">
                      {new Date(comment.created_at).toLocaleString()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditModal({ open: true, comment })}
                        className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 text-white text-xs px-3 py-1.5 rounded-md shadow-sm transition-all duration-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-300 text-white text-xs px-3 py-1.5 rounded-md shadow-sm transition-all duration-200"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-800 text-sm mb-3 group-hover:text-gray-900 transition">
                    {comment.text}
                  </p>

                  <div className="text-xs text-gray-500">By: <span className="font-medium">{comment.user}</span></div>
                </div>
              ))}
            </div>

          )}
        </div>
      </div>

      {/* Add Modal */}
      <CommentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddComment}
        title={`Add Comment to ${pageLabel}`}
        submitLabel="Add Comment"
      />

      {/* Edit Modal */}
      <CommentModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, comment: null })}
        onSubmit={handleEditComment}
        initialText={editModal.comment?.text || ""}
        title="Edit Comment"
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default AdminCommentList;
