import React from "react";

const CommentHistoryModal = ({ isOpen, onClose, history }) => {
  if (!isOpen || !history) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[80vh] animate-scaleIn relative">
          <h2 className="text-xl font-bold mb-4">Full Edit History</h2>

          <ul className="space-y-4 text-sm">
            {history.map((rec, i) => (
              <li key={i} className="border-b pb-3">
                <div className="flex justify-between text-gray-600 text-xs mb-1">
                  <span>{rec.modified_by_email || "Unknown"}</span>
                  <span>{new Date(rec.modified_at).toLocaleString()}</span>
                </div>
                <div className="text-xs mb-1">Action: {rec.action}</div>
                {rec.old_text && (
                  <div className="text-xs text-red-500 whitespace-pre-wrap">
                    ➤ Old: {rec.old_text}
                  </div>
                )}
                {rec.new_text && (
                  <div className="text-xs text-green-600 whitespace-pre-wrap">
                    ➤ New: {rec.new_text}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default CommentHistoryModal;
