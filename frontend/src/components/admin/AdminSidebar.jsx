import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiMessageSquare,
  FiFileText,
} from "react-icons/fi";

const AdminSidebar = ({ isOpen, toggle }) => {
  const location = useLocation();

  const navItems = [
    { path: "/adminpanel/dashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/adminpanel/users", label: "User Management", icon: <FiUsers /> },
    { path: "/adminpanel/comments", label: "Comments by Page", icon: <FiMessageSquare /> },
    { path: "/adminpanel/all-comment-histories", label: "Comment History Log", icon: <FiFileText /> },
  ];

  const linkClasses = (path) =>
    `flex items-center gap-3 px-4 py-2 text-sm rounded-md font-medium transition-all ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow-sm"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full w-64 z-50 bg-gray-900/95 text-white backdrop-blur-md border-r border-gray-800 p-6 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {/* Close button on mobile */}
      <button
        onClick={toggle}
        className="md:hidden text-right w-full text-white text-2xl mb-6 hover:text-gray-300"
        aria-label="Close Sidebar"
      >
        ✖
      </button>

      {/* Sidebar title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={linkClasses(item.path)}>
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
