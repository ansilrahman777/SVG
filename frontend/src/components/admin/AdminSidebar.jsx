import { Link, useLocation } from "react-router-dom";

const AdminSidebar = ({ isOpen, toggle }) => {
  const location = useLocation();

  const linkClasses = (path) =>
    `block px-4 py-2 rounded-md transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "hover:bg-gray-700 text-gray-100"
    }`;

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full w-64 z-50 bg-gray-900/95 text-white backdrop-blur-md border-r border-gray-700 p-6 space-y-4 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <button
        onClick={toggle}
        className="md:hidden text-right w-full text-white text-xl mb-4 hover:text-gray-300"
        aria-label="Close Sidebar"
      >
        ✖
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-wide">Admin Panel</h2>
      </div>

      <nav className="space-y-2">
        <Link to="/admin/dashboard" className={linkClasses("/admin/dashboard")}>
          🏠 Dashboard
        </Link>
        <Link to="/admin/users" className={linkClasses("/admin/users")}>
          👥 User Management
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
