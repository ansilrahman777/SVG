import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const EditPermissionsModal = ({ isOpen, onClose, user, pages, pageMap, onPermissionsUpdated }) => {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (user) {
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
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-3xl max-h-[90vh] overflow-auto rounded-xl bg-white/90 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out transform opacity-100 scale-100"
        >
          <h2 className="mb-6 text-2xl font-bold">Edit Permissions for {user.email}</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3 text-left">Page</th>
                  <th className="border p-3">View</th>
                  <th className="border p-3">Create</th>
                  <th className="border p-3">Edit</th>
                  <th className="border p-3">Delete</th>
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
                    <tr key={page} className="odd:bg-white even:bg-gray-50">
                      <td className="border p-2">{page}</td>
                      {["can_view", "can_create", "can_edit", "can_delete"].map((perm) => (
                        <td key={perm} className="border p-2 text-center">
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
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded bg-gray-300 px-5 py-2 font-medium text-gray-800 transition hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
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
