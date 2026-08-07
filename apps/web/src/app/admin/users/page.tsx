"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Truck,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  usersApi,
  type UserRecord,
  type CreateUserInput,
} from "@/lib/api/users-api";

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState<UserRecord[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add staff modal state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateUserInput>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "STAFF",
    phoneNumber: "",
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await usersApi.getUsers({
        search: searchQuery || undefined,
        role: selectedRole !== "ALL" ? selectedRole : undefined,
      });
      setUsersList(res.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load users";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this account?")) return;
    try {
      await usersApi.deactivateUser(id);
      fetchUsers();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to deactivate user";
      alert(msg);
    }
  };

  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await usersApi.createUser(formData);
      setIsAddStaffOpen(false);
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "STAFF",
        phoneNumber: "",
      });
      fetchUsers();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create staff account";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" /> User & Staff Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your shop staff (Delivery Boys, Cashiers, Managers) and
            customer accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-cyan-400" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-950 transition"
          >
            <UserPlus className="w-4 h-4" /> Add Staff Account
          </button>
        </div>
      </div>

      {/* Filters & Search Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "ADMIN", "STAFF", "DELIVERY_BOY", "CUSTOMER"].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                selectedRole === role
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/50"
                  : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {role.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-72 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Users Data Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">User</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Phone Number</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Created Date</th>
                <th className="p-3.5 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-500" />
                    Loading user accounts...
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No accounts match your filter criteria.
                  </td>
                </tr>
              ) : (
                usersList.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800/40 transition"
                  >
                    <td className="p-3.5 pl-4 font-bold text-white">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-3.5 text-slate-300 font-mono">
                      {user.email}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">
                      {user.phoneNumber || "—"}
                    </td>
                    <td className="p-3.5">
                      {user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30 flex items-center gap-1 w-fit">
                          <Shield className="w-3 h-3" /> {user.role}
                        </span>
                      ) : user.role === "DELIVERY_BOY" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-500/30 flex items-center gap-1 w-fit">
                          <Truck className="w-3 h-3" /> DELIVERY BOY
                        </span>
                      ) : user.role === "STAFF" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 w-fit">
                          <UserCheck className="w-3 h-3" /> STAFF
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-slate-400 border border-slate-800 w-fit">
                          CUSTOMER
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.isActive
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-950 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {user.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      {user.isActive && user.role !== "SUPER_ADMIN" && (
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          className="bg-rose-950 hover:bg-rose-900 border border-rose-800/60 text-rose-300 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto transition"
                        >
                          <UserX className="w-3 h-3" /> Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Account Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" /> Create Staff
              Account
            </h3>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="e.g. John"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="e.g. Doe"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="staff@samudshabkat.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Staff Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="STAFF">Shop Staff / Cashier</option>
                  <option value="DELIVERY_BOY">Delivery Boy (COD)</option>
                  <option value="ADMIN">Shop Manager / Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="+971 50 123 4567"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UserPlus className="w-3.5 h-3.5" />
                  )}
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
