import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/userAPI";
import CommentModal from "../../components/CommentModal";
import Pagination from "../../components/Pagination";
import Header from "../../components/user/Header";
import { toast } from "react-toastify";

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
  const [expandedCards, setExpandedCards] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  const loggedInEmail = localStorage.getItem("user_email");

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
      } catch {
        toast.error("Failed to load comments or permissions.", { autoClose: 2000 });

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
        toast.success("Comment updated.", { autoClose: 2000 });
      } else {
        await API.post(`accounts/page-comments/${page_key}/`, { text });
        toast.success("Comment added.", { autoClose: 2000 });
      }
      setModalOpen(false);
      const commentsRes = await API.get(`accounts/page-comments/${page_key}/`);
      setComments(commentsRes.data);
    } catch {
      toast.error("Failed to save comment.", { autoClose: 2000 });
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await API.delete(`accounts/my-comment/${commentId}/`);
      toast.success("Comment deleted.", { autoClose: 2000 });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      toast.error("Failed to delete comment.", { autoClose: 2000 });
    }
  };

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);
  const paginatedComments = comments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <div className="p-6 text-center">Loading comments...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Header />
      <main className="flex-grow p-6 max-w-7xl mx-auto animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Comments for {pageLabel}
            <span className="ml-3 text-sm font-normal text-gray-600 bg-gray-200 rounded-full px-3 py-1">
              {comments.length} comments
            </span>
          </h2>
          {permissions.can_create && (
            <button
              onClick={openAddModal}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded shadow transition"
            >
              + Add Comment
            </button>
          )}
        </div>

        <div className="my-8 p-4 border border-gray-300 rounded-lg bg-white shadow-sm flex items-center gap-6">
          <h4 className="text-lg font-semibold text-gray-700">Your Permissions:</h4>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {permissions.can_view && <span title="Can View">👁️</span>}
            {permissions.can_create && <span title="Can Add">➕</span>}
            {permissions.can_edit && <span title="Can Edit">✏️</span>}
            {permissions.can_delete && <span title="Can Delete">🗑️</span>}
          </div>
        </div>

        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments available for this page.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedComments.map((comment) => {
                const isLong = comment.text.length > 100;
                const expanded = expandedCards[comment.id];
                return (
                  <div
                    key={comment.id}
                    className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-blue-400 transition duration-300 w-[300px] h-[260px] flex flex-col justify-between"
                  >
                    <div className="text-sm font-semibold text-gray-800 mb-2 truncate">
                      {comment.user_email === loggedInEmail ? "Your comment" : comment.user_email}
                    </div>

                    <div className="text-gray-700 text-sm mb-2">
                      <span className={expanded ? "" : "line-clamp-3"}>{comment.text}</span>
                      {isLong && (
                        <button
                          onClick={() => toggleExpand(comment.id)}
                          className="text-blue-500 text-xs ml-1 hover:underline"
                        >
                          {expanded ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-gray-400 italic mb-2">
                      {new Date(comment.created_at).toLocaleString()}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      {permissions.can_edit && (
                        <button
                          onClick={() => openEditModal(comment)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-md"
                        >
                          ✏️
                        </button>
                      )}
                      {permissions.can_delete && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md"
                        >
                          🗑️
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
        

        <CommentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
          initialText={modalInitialText}
          title={modalTitle}
          submitLabel={modalSubmitLabel}
        />
      </main>
    </div>
  );
};

export default CommentsPage;
