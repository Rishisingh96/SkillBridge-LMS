import React from "react";

import {
  Ban,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react";

const UserTable = ({
  users,
  onBan,
  onUnban,
  onDelete,
  onRoleChange,
  hideActions = false,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left px-6 py-4">
                User
              </th>

              <th className="text-left px-6 py-4">
                Email
              </th>

              <th className="text-left px-6 py-4">
                Role
              </th>

              <th className="text-left px-6 py-4">
                Status
              </th>

              {!hideActions && (
                <th className="text-center px-6 py-4">
                  Actions
                </th>
              )}

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user._id}
                className="border-b hover:bg-gray-50 transition-all"
              >

                {/* USER */}

                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <img
                      src={user.photoUrl}
                      alt=""
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div>

                      <h2 className="font-bold text-gray-800">
                        {user.name}
                      </h2>

                      <p className="text-sm text-gray-500">
                        Joined Recently
                      </p>

                    </div>

                  </div>

                </td>

                {/* EMAIL */}

                <td className="px-6 py-5 text-gray-700">

                  {user.email}

                </td>

                {/* ROLE */}

                <td className="px-6 py-5">

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium
                    ${
                      user.role === "educator"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user.role}
                  </span>

                </td>

                {/* STATUS */}

                <td className="px-6 py-5">

                  {user.isBanned ? (

                    <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium">
                      Banned
                    </span>

                  ) : (

                    <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                      Active
                    </span>

                  )}

                </td>

                {/* ACTIONS */}

                {!hideActions && (

                  <td className="px-6 py-5">

                    <div className="flex items-center justify-center gap-3">

                      {user.isBanned ? (

                        <button
                          onClick={() =>
                            onUnban(user._id)
                          }
                          className="bg-green-100 text-green-600 p-3 rounded-xl hover:bg-green-200 transition-all"
                        >

                          <ShieldCheck size={18} />

                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            onBan(user._id)
                          }
                          className="bg-yellow-100 text-yellow-600 p-3 rounded-xl hover:bg-yellow-200 transition-all"
                        >

                          <Ban size={18} />

                        </button>

                      )}

                      <button
                        onClick={() =>
                          onRoleChange(
                            user._id,
                            user.role === "student"
                              ? "educator"
                              : "student"
                          )
                        }
                        className="bg-blue-100 text-blue-600 p-3 rounded-xl hover:bg-blue-200 transition-all"
                      >

                        <UserCog size={18} />

                      </button>

                      <button
                        onClick={() =>
                          onDelete(user._id)
                        }
                        className="bg-red-100 text-red-600 p-3 rounded-xl hover:bg-red-200 transition-all"
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </td>

                )}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default UserTable;