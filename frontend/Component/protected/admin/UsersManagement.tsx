"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAxios } from "../../../context/AxiosProvider";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tokenApproveStatus: boolean;
  tokenApplied: boolean;
  createdAt: string;
}

export default function UsersManagement() {
  const api = useAxios();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [api]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user and all their memorials?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleApproveToken = async (id: string) => {
    try {
      await api.post(`/profile/approve-token/${id}`);
      toast.success("Coupon approved successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to approve coupon");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading users...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-semibold text-[#1e3a5f]">
        User Management
      </h1>

      <div className="overflow-hidden rounded-xl border border-[#ece6dd] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8f3ec] text-[#7b6a58]">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Coupon Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece6dd]">
              {users.map((user) => (
                <tr key={user._id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-[#1e3a5f]">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 text-[#626262]">{user.email}</td>
                  <td className="px-6 py-4 text-[#626262] capitalize">{user.role}</td>
                  <td className="px-6 py-4 text-[#626262]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {user.tokenApproveStatus ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Approved
                      </span>
                    ) : user.tokenApplied ? (
                      <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                        Not Applied
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {user.tokenApplied && !user.tokenApproveStatus && (
                        <button
                          onClick={() => handleApproveToken(user._id)}
                          className="rounded-md bg-[#1e3a5f] px-3 py-1 text-xs text-white transition hover:bg-[#16314f]"
                        >
                          Approve Coupon
                        </button>
                      )}
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#626262]">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
