const AdminNavbar = ({ toggleSidebar }) => {
  return (
    <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200 text-gray-800 px-4 md:px-6 py-3 flex justify-between items-center shadow-sm transition">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-2xl text-gray-700 hover:text-blue-600 transition"
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>

        <h1 className="text-xl font-bold tracking-tight">Super Admin Dashboard</h1>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/admin/login";
        }}
        className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-all"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
