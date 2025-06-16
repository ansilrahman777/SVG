import { useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AddUserModal from "../../components/admin/AddUserModal";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleUserAdded = (newUser) => {
    setModalOpen(false);
    // Optional: trigger toast or refetch stats
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-auto">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <div className="p-4 md:p-8 animate-fadeIn">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Quick overview and actions. Manage your data, users, and pages with ease.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Users */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h2>
              <p className="text-3xl font-bold text-blue-600">8</p>
            </div>

            {/* Pages */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Pages</h2>
              <p className="text-3xl font-bold text-green-600">10</p>
            </div>

            {/* Add New User */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Add New User</h2>
                <p className="text-gray-600 mb-4">
                  Manage admin users and permissions.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-md shadow-md transition duration-200"
              >
                + Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddUserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default Dashboard;
