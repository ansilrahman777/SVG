import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import EditPermissionsModal from "../../components/admin/EditPermissionsModal";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiSettings } from "react-icons/fi";

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

    if (loading) return <div className="p-6">Loading users...</div>;
    if (error) return <div className="text-red-600 p-6">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-auto">
                <AdminNavbar toggleSidebar={toggleSidebar} />
                <div className="p-4 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

                    <div className="overflow-auto rounded-xl border border-gray-200 shadow-sm bg-white">
                        <table className="min-w-[1000px] w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 sticky top-0 z-10 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                                    {pages.map((page) => (
                                        <th key={page} className="px-4 py-3 font-semibold text-center text-gray-700">{page}</th>
                                    ))}
                                    <th className="px-4 py-3 font-semibold text-center text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-2 py-3 font-medium text-gray-900">{user.email}</td>
                                        {pages.map((page) => {
                                            const pageKey = pageMap[page];
                                            const permObj = user.permissions.find((p) => p.page === pageKey);
                                            return (
                                                <td key={page} className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2 text-gray-500">
                                                        {permObj?.can_view && <FiEye title="View" />}
                                                        {permObj?.can_create && <FiPlus title="Create" />}
                                                        {permObj?.can_edit && <FiEdit title="Edit" />}
                                                        {permObj?.can_delete && <FiTrash2 title="Delete" />}
                                                        {!permObj && <span className="text-gray-400">-</span>}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setEditPermissionsOpen(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit Permissions"
                                            >
                                                <FiSettings />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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
