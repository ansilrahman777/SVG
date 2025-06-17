import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const EditPermissionsModal = ({ isOpen, onClose, user, pages, pageMap, onPermissionsUpdated }) => {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (user) {
      // Convert array of permission objects to a map keyed by page
      const initialPermissions = {};
      (user.permissions || []).forEach((perm) => {
        initialPermissions[perm.page] = {
          can_view: perm.can_view,
          can_create: perm.can_create,
          can_edit: perm.can_edit,
          can_delete: perm.can_delete,
        };
      });
      setPermissions(initialPermissions);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleCheckboxChange = (page, permissionType) => {
    setPermissions((prev) => ({
      ...prev,
      [page]: {
        ...(prev[page] || {
          can_view: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
        }),
        [permissionType]: !((prev[page] && prev[page][permissionType]) || false),
      },
    }));
  };

  const handleSave = async () => {
    try {
      // Convert back to array for API
      const sanitizedPermissions = Object.entries(permissions).map(([page, perms]) => ({
        page,
        can_view: perms.can_view,
        can_create: perms.can_create,
        can_edit: perms.can_edit,
        can_delete: perms.can_delete,
      }));

      await API.post(`adminpanel/assign-permission/`, {
        user_id: user.id,
        permissions: sanitizedPermissions,
      });

      onPermissionsUpdated({ ...user, permissions: sanitizedPermissions });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update permissions.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-auto max-h-[90vh]">
          <h2 className="text-2xl font-semibold mb-4">Edit Permissions for {user.email}</h2>

          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Page</th>
                <th className="p-2 border">View</th>
                <th className="p-2 border">Create</th>
                <th className="p-2 border">Edit</th>
                <th className="p-2 border">Delete</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => {
                const pageKey = pageMap[page];
                const current = permissions[pageKey] || {
                  can_view: false,
                  can_create: false,
                  can_edit: false,
                  can_delete: false,
                };

                return (
                  <tr key={page}>
                    <td className="p-2 border">{page}</td>
                    {["can_view", "can_create", "can_edit", "can_delete"].map((perm) => (
                      <td key={perm} className="p-2 border text-center">
                        <input
                          type="checkbox"
                          checked={current[perm]}
                          onChange={() => handleCheckboxChange(pageKey, perm)}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Permissions
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPermissionsModal;
