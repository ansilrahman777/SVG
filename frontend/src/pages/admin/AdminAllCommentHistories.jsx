import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AdminAllCommentHistories = () => {
  const [histories, setHistories] = useState([]);
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
      alert("Failed to load comment history records.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Comment Histories</h2>

      {histories.length === 0 ? (
        <p>No comment history available.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Comment ID</th>
              <th className="border px-4 py-2">Modified By</th>
              <th className="border px-4 py-2">Action</th>
              <th className="border px-4 py-2">Old Text</th>
              <th className="border px-4 py-2">New Text</th>
              <th className="border px-4 py-2">Modified At</th>
            </tr>
          </thead>
          <tbody>
            {histories.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.comment_id || "Deleted Comment"}</td>
                <td className="border px-4 py-2">{item.modified_by_email || "Unknown"}</td>
                <td className="border px-4 py-2">{item.action}</td>
                <td className="border px-4 py-2">{item.old_text}</td>
                <td className="border px-4 py-2">{item.new_text}</td>
                <td className="border px-4 py-2">
                  {new Date(item.modified_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back
      </button>
    </div>
  );
};

export default AdminAllCommentHistories;
