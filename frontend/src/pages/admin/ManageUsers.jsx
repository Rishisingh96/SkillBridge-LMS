import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllUsers,
  banUser,
  unbanUser,
  deleteUser,
  changeUserRole,
} from "../../redux/slices/adminSlice";

import UserTable from "../../components/admin/UserTable";

import { Users, Loader2 } from "lucide-react";

const ManageUsers = () => {
  const dispatch = useDispatch();

  const { users, loading } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="w-full">
      
      {/* PAGE HEADER */}
      <div className="mb-8">
        
        <div className="flex items-center gap-4 mb-2">
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
            
            <Users size={28} className="text-white" />
          
          </div>

          <div>
            
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Users
            </h1>

            <p className="text-gray-500 mt-1">
              View and manage all platform users
            </p>

          </div>

        </div>

      </div>


      {/* CONTENT */}
      {loading ? (
        
        <div className="flex flex-col items-center justify-center py-20">
          
          <Loader2 
            size={48} 
            className="text-purple-500 animate-spin mb-4" 
          />
          
          <p className="text-gray-500 text-lg">
            Loading users...
          </p>

        </div>

      ) : users && users.length > 0 ? (
        
        <UserTable
          users={users}
          onBan={(userId) => dispatch(banUser(userId))}
          onUnban={(userId) => dispatch(unbanUser(userId))}
          onDelete={(userId) => dispatch(deleteUser(userId))}
          onRoleChange={(userId, newRole) =>
            dispatch(
              changeUserRole({
                userId,
                role: newRole,
              })
            )
          }
        />

      ) : (
        
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          
          <Users 
            size={64} 
            className="text-gray-300 mx-auto mb-4" 
          />
          
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Users Found
          </h3>
          
          <p className="text-gray-500">
            There are no users registered on the platform yet.
          </p>

        </div>

      )}

    </div>
  );
};

export default ManageUsers;