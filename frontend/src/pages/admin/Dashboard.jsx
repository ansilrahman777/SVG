import { useState, useEffect } from "react";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AddUserModal from "../../components/admin/AddUserModal";
import API from "../../api/axios";
import Pagination from "../../components/Pagination";

const pages = [
  "Products List",
  "Marketing List",
  "Order List",
  "Media Plans",
  "Offer Pricing SKUs",
  "Clients",
  "Suppliers",
  "Customer Support",
  "Sales Reports",
  "Finance & Accounting",
];

const pageMap = {
  "Products List": "products_list",
  "Marketing List": "marketing_list",
  "Order List": "order_list",
  "Media Plans": "media_plans",
  "Offer Pricing SKUs": "offer_pricing_skus",
  Clients: "clients",
  Suppliers: "suppliers",
  "Customer Support": "customer_support",
  "Sales Reports": "sales_reports",
  "Finance & Accounting": "finance_accounting",
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalComments, setTotalComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleUserAdded = () => {
    setModalOpen(false);
    fetchCounts();
    fetchUsersPermissions();
  };

  const fetchCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/adminpanel/dashboard/counts/");
      setTotalUsers(response.data.total_users);
      setTotalComments(response.data.total_comments);
    } catch (err) {
      setError("Failed to load counts");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersPermissions = async () => {
    try {
      const response = await API.get("/adminpanel/users-permissions/");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load user permissions");
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchUsersPermissions();
  }, []);

  // Pagination calculation
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-auto">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <div className="p-4 md:p-8 animate-fadeIn">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-6">Quick overview and actions. Manage your data, users, and pages with ease.</p>

          {error && <p className="text-red-600">{error}</p>}

          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h2>
                <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Comments</h2>
                <p className="text-3xl font-bold text-green-600">{totalComments}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Add New User</h2>
                  <p className="text-xl font-bold text-purple-600">Create New User</p>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-md shadow-md transition duration-200"
                >
                  + Add User
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="min-w-[1000px] w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                  {pages.map((page) => (
                    <th key={page} className="px-4 py-3 font-semibold text-center text-gray-700">
                      {page}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-2 py-3 font-medium text-black">{user.email}</td>
                    {pages.map((page) => {
                      const pageKey = pageMap[page];
                      const permObj = user.permissions.find((p) => p.page === pageKey);
                      return (
                        <td key={page} className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2 text-gray-900">
                            {permObj?.can_view && <FiEye title="View" className="hover:text-blue-600" />}
                            {permObj?.can_create && <FiPlus title="Create" className="hover:text-blue-600" />}
                            {permObj?.can_edit && <FiEdit title="Edit" className="hover:text-blue-600" />}
                            {permObj?.can_delete && <FiTrash2 title="Delete" className="hover:text-blue-600" />}
                            {!permObj && <span className="text-gray-400">----</span>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
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
