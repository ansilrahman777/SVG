import React, { useState } from "react";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiSettings } from "react-icons/fi";
import Pagination from "../Pagination";

const USERS_PER_PAGE = 6;

const UserPermissionTable = ({ users, pages, pageMap, onEditPermissions }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  // Get the users for the current page only
  const paginatedUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="min-w-[1000px] w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 sticky top-0 z-10 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
              {pages.map((page) => (
                <th
                  key={page}
                  className="px-4 py-3 font-semibold text-center text-gray-700"
                >
                  {page}
                </th>
              ))}
              <th className="px-4 py-3 font-semibold text-center text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-2 py-3 font-medium text-black">{user.email}</td>
                {pages.map((page) => {
                  const pageKey = pageMap[page];
                  const permObj = user.permissions.find((p) => p.page === pageKey);
                  return (
                    <td key={page} className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2 text-gray-900">
                        {permObj?.can_view && <FiEye title="View" />}
                        {permObj?.can_create && <FiPlus title="Create" />}
                        {permObj?.can_edit && <FiEdit title="Edit" />}
                        {permObj?.can_delete && <FiTrash2 title="Delete" />}
                        {!permObj && <span className="text-gray-400">- - - -</span>}
                      </div>
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEditPermissions(user)}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default UserPermissionTable;
