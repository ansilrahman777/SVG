import React from "react";

const PageCard = ({ pageLabel, count, color, onClick }) => {
  return (
    <div
      className={`relative overflow-hidden ${color} rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer h-[260px] flex flex-col justify-between`}
      onClick={onClick}
    >
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

      <div className="relative pt-10 px-6 text-center">
        <h3 className="text-white font-semibold text-lg leading-tight truncate">
          {pageLabel}
        </h3>
      </div>

      <div className="relative text-white px-6 pb-6">
        {/* <p className="text-sm opacity-75 mb-2 text-center">Total Comments</p> */}
        <div className="flex justify-center">
          <span className="bg-white text-gray-800 rounded-full text-sm font-semibold px-4 py-1">
            {count}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageCard;
