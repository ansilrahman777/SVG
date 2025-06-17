import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import EditPermissionsModal from "../../components/admin/EditPermissionsModal";
import UserPermissionTable from "../../components/admin/UserPermissionTable";

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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editPermissionsOpen, setEditPermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const fetchUsersPermissions = async () => {
    try {
      const response = await API.get("adminpanel/users-permissions/");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersPermissions();
  }, []);


  if (error) return <div className="text-red-600 p-6">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-auto">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <div className="p-4 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

          <UserPermissionTable
            users={users}
            pages={pages}
            pageMap={pageMap}
            onEditPermissions={(user) => {
              setSelectedUser(user);
              setEditPermissionsOpen(true);
            }}
          />

          {selectedUser && (
            <EditPermissionsModal
              isOpen={editPermissionsOpen}
              onClose={() => {
                setEditPermissionsOpen(false);
                setSelectedUser(null);
              }}
              user={selectedUser}
              pages={pages}
              pageMap={pageMap}
              onPermissionsUpdated={(updatedUser) => {
                setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
                setEditPermissionsOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
