import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import CommentModal from "../../components/CommentModal";

const CommentsPage = () => {
  const { page_key } = useParams();

  const [comments, setComments] = useState([]);
  const [pageLabel, setPageLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({
    can_view: false,
    can_create: false,
    can_edit: false,
    can_delete: false,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalSubmitLabel, setModalSubmitLabel] = useState("");
  const [modalInitialText, setModalInitialText] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);

  // Added state for current logged-in user email
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const PAGE_LABELS = {
    products_list: "Products List",
    marketing_list: "Marketing List",
    order_list: "Order List",
    media_plans: "Media Plans",
    offer_pricing_skus: "Offer Pricing SKUs",
    clients: "Clients",
    suppliers: "Suppliers",
    customer_support: "Customer Support",
    sales_reports: "Sales Reports",
    finance_accounting: "Finance & Accounting",
  };

  // Fetch current logged-in user's email
  useEffect(() => {
    const fetchCurrentUserEmail = async () => {
      try {
        const res = await API.get("accounts/current-user/"); // Adjust API if different
        setCurrentUserEmail(res.data.email);
      } catch (err) {
        setCurrentUserEmail("");
      }
    };
    fetchCurrentUserEmail();
  }, []);

  useEffect(() => {
    setPageLabel(PAGE_LABELS[page_key] || page_key);

    const fetchCommentsAndPermissions = async () => {
      setLoading(true);
      try {
        const commentsRes = await API.get(`accounts/page-comments/${page_key}/`);
        setComments(commentsRes.data);

        const permsRes = await API.get("accounts/my-pages/");
        const pagePerms = permsRes.data.find((p) => p.page_key === page_key);
        if (pagePerms) {
          setPermissions({
            can_view: pagePerms.can_view,
            can_create: pagePerms.can_create,
            can_edit: pagePerms.can_edit,
            can_delete: pagePerms.can_delete,
          });
        }
      } catch (err) {
        alert("Failed to load comments or permissions.");
      }
      setLoading(false);
    };

    if (page_key) {
      fetchCommentsAndPermissions();
    }
  }, [page_key]);

  const openAddModal = () => {
    setModalTitle("Add Comment");
    setModalSubmitLabel("Add");
    setModalInitialText("");
    setEditCommentId(null);
    setModalOpen(true);
  };

  const openEditModal = (comment) => {
    setModalTitle("Edit Comment");
    setModalSubmitLabel("Save");
    setModalInitialText(comment.text);
    setEditCommentId(comment.id);
    setModalOpen(true);
  };

  const handleModalSubmit = async (text) => {
    try {
      if (editCommentId) {
        await API.put(`accounts/my-comment/${editCommentId}/`, { text });
        alert("Comment updated.");
      } else {
        await API.post(`accounts/page-comments/${page_key}/`, { text });
        alert("Comment added.");
      }
      setModalOpen(false);

      const commentsRes = await API.get(`accounts/page-comments/${page_key}/`);
      setComments(commentsRes.data);
    } catch (err) {
      alert("Failed to save comment.");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await API.delete(`accounts/my-comment/${commentId}/`);
      alert("Comment deleted.");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      alert("Failed to delete comment.");
    }
  };

  if (loading) return <div className="p-6">Loading comments...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Comments for {pageLabel}</h2>

      {permissions.can_create && (
        <button
          onClick={openAddModal}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add Comment
        </button>
      )}

      {comments.length === 0 && (
        <p className="text-gray-500">No comments available for this page.</p>
      )}

      <ul className="space-y-4">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="border p-3 rounded shadow-sm bg-white flex justify-between items-start"
          >
            <div>
              <p>{comment.text}</p>
              <small className="text-gray-500">
                By:{" "}
                {comment.user_email === currentUserEmail
                  ? "Your comment"
                  : comment.user_email || comment.user}{" "}
                | {new Date(comment.created_at).toLocaleString()}
              </small>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              {permissions.can_edit && (
                <button
                  onClick={() => openEditModal(comment)}
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Edit
                </button>
              )}
              {permissions.can_delete && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <CommentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialText={modalInitialText}
        title={modalTitle}
        submitLabel={modalSubmitLabel}
      />
    </div>
  );
};

export default CommentsPage;
