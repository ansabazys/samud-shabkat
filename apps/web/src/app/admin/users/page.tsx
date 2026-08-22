"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  UserCheck,
  UserX,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react";
import {
  usersApi,
  type UserRecord,
  type UserQueryParams,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/lib/api/users-api";
import { useAuthStore } from "@/store/auth-store";

const ROLE_FILTERS = [
  { label: "All Users", value: "" },
  { label: "Super Admins", value: "SUPER_ADMIN" },
  { label: "Admins", value: "ADMIN" },
  { label: "Staff", value: "STAFF" },
  { label: "Customers", value: "CUSTOMER" },
];

export default function AdminUsersPage() {
  const currentUser = useAuthStore((state) => state.user);

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<string>("STAFF");
  const [formPhone, setFormPhone] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: UserQueryParams = {
        page,
        limit: 25,
        search: search || undefined,
        role: roleFilter || undefined,
        isActive: activeFilter === "" ? undefined : activeFilter === "true",
      };

      const res = await usersApi.getUsers(params);
      setUsers(res.data);
      setTotal(res.total);
    } catch (err: any) {
      console.error("Failed to load users:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to load user list.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormFirstName("");
    setFormLastName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("STAFF");
    setFormPhone("");
    setFormIsActive(true);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserRecord) => {
    setEditingUser(user);
    setFormFirstName(user.firstName);
    setFormLastName(user.lastName);
    setFormEmail(user.email);
    setFormPassword(""); // Leave empty unless updating
    setFormRole(user.role);
    setFormPhone(user.phoneNumber || "");
    setFormIsActive(user.isActive);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setActionSuccess(null);

    if (!formFirstName || !formLastName || !formEmail) {
      setModalError("First name, last name, and email are required.");
      return;
    }

    if (!editingUser && (!formPassword || formPassword.length < 6)) {
      setModalError("Password is required and must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingUser) {
        // Update user
        const updatePayload: UpdateUserInput = {
          firstName: formFirstName,
          lastName: formLastName,
          email: formEmail,
          role: formRole,
          phoneNumber: formPhone || undefined,
          isActive: formIsActive,
        };
        if (formPassword) {
          updatePayload.password = formPassword;
        }

        const updated = await usersApi.updateUser(editingUser.id, updatePayload);
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
        setActionSuccess(`User ${updated.firstName} ${updated.lastName} updated successfully.`);
      } else {
        // Create user
        const createPayload: CreateUserInput = {
          firstName: formFirstName,
          lastName: formLastName,
          email: formEmail,
          password: formPassword,
          role: formRole,
          phoneNumber: formPhone || undefined,
          isActive: formIsActive,
        };

        const created = await usersApi.createUser(createPayload);
        setUsers((prev) => [created, ...prev]);
        setTotal((prev) => prev + 1);
        setActionSuccess(`New user ${created.firstName} ${created.lastName} created.`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save user:", err);
      setModalError(
        err?.response?.data?.message || err?.message || "Failed to save user record.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user: UserRecord) => {
    const nextStatus = !user.isActive;
    setActionSuccess(null);

    try {
      const updated = await usersApi.updateUser(user.id, { isActive: nextStatus });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      setActionSuccess(
        `Account ${user.email} ${nextStatus ? "activated" : "deactivated"}.`,
      );
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update user status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-emerald-700" />
            Users & Staff Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage system access, create administrator/staff accounts, and view customer profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User / Staff</span>
          </button>
        </div>
      </div>

      {/* Global Success / Action Notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-900 text-xs font-bold shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="flex-1">{actionSuccess}</span>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-800 text-xs font-bold shadow-2xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-4 shadow-2xs">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100">
          {ROLE_FILTERS.map((tab) => {
            const isActive = roleFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setRoleFilter(tab.value);
                  setPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Filters */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex-1 relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Name, Email, Phone, or Company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl focus:outline-none"
            >
              <option value="">All Account Statuses</option>
              <option value="true">Active Accounts Only</option>
              <option value="false">Inactive / Suspended</option>
            </select>

            <button
              type="submit"
              className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer shadow-2xs"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Users Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Fetching accounts database...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 font-medium">
            No user records match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Contact & Company</th>
                  <th className="py-3.5 px-4">System Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Date Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-xs shrink-0">
                          {u.firstName?.[0] || "U"}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-950 block">
                            {u.firstName} {u.lastName}
                          </span>
                          <span className="text-[11px] text-slate-500 block font-normal">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="text-slate-800 font-bold block">
                          {u.phoneNumber || "No phone linked"}
                        </span>
                        {u.companyName && (
                          <span className="text-emerald-800 font-extrabold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-emerald-700" />
                            {u.companyName}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          u.role === "SUPER_ADMIN"
                            ? "bg-purple-50 text-purple-800 border border-purple-200"
                            : u.role === "ADMIN"
                              ? "bg-sky-50 text-sky-800 border border-sky-200"
                              : u.role === "STAFF"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {u.role.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200 uppercase tracking-wider">
                          <UserX className="w-3 h-3 text-rose-600" />
                          Suspended
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-slate-500 font-normal">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          title="Edit User Profile"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`p-2 rounded-xl border transition cursor-pointer ${
                            u.isActive
                              ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          }`}
                          title={u.isActive ? "Deactivate Account" : "Activate Account"}
                        >
                          {u.isActive ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {users.length > 0 && (
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>
              Showing {users.length} of {total} accounts (Page {page} of {Math.ceil(total / 25) || 1})
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &larr; Previous
              </button>
              <button
                disabled={page >= (Math.ceil(total / 25) || 1)}
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  {editingUser ? "Edit User Account" : "Create New User"}
                </span>
                <h2 className="text-lg font-black text-slate-950 uppercase tracking-tight mt-1">
                  {editingUser ? `${editingUser.firstName} ${editingUser.lastName}` : "User Information"}
                </h2>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Error */}
            {modalError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-800 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveUser} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mohammed"
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ansab"
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ansab@samudshabkat.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">
                  {editingUser ? "Password (Leave blank to keep existing)" : "Password *"}
                </label>
                <input
                  type="password"
                  placeholder={editingUser ? "••••••••" : "Min 6 characters"}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1">Assign System Role *</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-extrabold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Full System Access)</option>
                    <option value="ADMIN">ADMIN (Backoffice Operations)</option>
                    <option value="STAFF">STAFF (Store Counter)</option>
                    <option value="CUSTOMER">CUSTOMER (Storefront User)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98460 00000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-bold">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span>Account Active & Enabled</span>
                </label>
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingUser ? "Save Changes" : "Create Account"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
