import React, { useState, useEffect } from "react";

const CommentModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialText = "",
  title,
  submitLabel,
}) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") {
      alert("Comment text cannot be empty.");
      return;
    }
    onSubmit(text.trim());
  };

  return (
    <>
      {/* Overlay with blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-scaleIn">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows="5"
              placeholder="Enter your comment here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
              >
                {submitLabel}
              </button>
            </div>
          </form>

          {/* Close icon */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Add keyframe animation */}
      <style>{`
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default CommentModal;
