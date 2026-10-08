import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, Search, Filter, Plus, Edit2, Trash2, CheckCircle2, XCircle, 
  Eye, UserCheck, Shield, Phone, Mail, X, Check
} from 'lucide-react';

export default function UsersManagement() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [users, setUsers] = useState([
    { id: "USR-101", name: "Aarav Mehta", email: "aarav.m@example.com", phone: "+91 98220 11223", role: "CUSTOMER", status: "Active", createdDate: "2026-01-15" },
    { id: "USR-102", name: "Suresh Patil", email: "suresh.p@njtours.com", phone: "+91 98220 33445", role: "DRIVER", status: "Active", createdDate: "2025-11-20" },
    { id: "USR-103", name: "Admin NJ HQ", email: "admin@njtours.com", phone: "+91 98220 99999", role: "ADMIN", status: "Active", createdDate: "2025-01-01" },
    { id: "USR-104", name: "Priya Sharma", email: "priya.s@example.com", phone: "+91 98220 55667", role: "CUSTOMER", status: "Active", createdDate: "2026-02-01" },
    { id: "USR-105", name: "Ramesh Sharma", email: "ramesh.s@njtours.com", phone: "+91 98220 77889", role: "DRIVER", status: "Inactive", createdDate: "2025-12-10" }
  ]);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('CUSTOMER');

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteOpen(false);
    }
  };

  const handleOpenEdit = (u) => {
    setSelectedUser(u);
    setEditName(u.name);
    setEditPhone(u.phone);
    setEditRole(u.role);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, name: editName, phone: editPhone, role: editRole } : u));
    setIsEditOpen(false);
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 text-white pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black">User Accounts Management</h2>
          <p className="text-xs text-slate-400">View, search, edit, activate, and manage system roles</p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0B5ED7]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
            <Filter className="w-4 h-4" /> Role:
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="DRIVER">Driver</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
            Status:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-900/50">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0B5ED7]/20 border border-[#0B5ED7]/40 text-[#0B5ED7] flex items-center justify-center font-bold text-xs shrink-0">
                      {u.name[0]}
                    </div>
                    <div>
                      <div>{u.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{u.id}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
                  <td className="py-3.5 px-4 text-slate-300">{u.phone}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold border ${
                      u.role === 'ADMIN' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      u.role === 'DRIVER' ? 'bg-purple-950 text-purple-400 border-purple-800' :
                      'bg-blue-950 text-blue-400 border-blue-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button 
                      onClick={() => handleToggleStatus(u.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border cursor-pointer ${
                        u.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {u.status}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{u.createdDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => { setSelectedUser(u); setIsViewOpen(true); }}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 rounded-lg bg-slate-900 text-amber-400 hover:bg-slate-800"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { setSelectedUser(u); setIsDeleteOpen(true); }}
                        className="p-1.5 rounded-lg bg-slate-900 text-rose-400 hover:bg-slate-800"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      {isViewOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">User Account Profile</h3>
              <button onClick={() => setIsViewOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-500">ID:</span> <span className="font-mono text-amber-400 font-bold">{selectedUser.id}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-500">Name:</span> <span className="font-bold text-white">{selectedUser.name}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-500">Email:</span> <span>{selectedUser.email}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-500">Phone:</span> <span>{selectedUser.phone}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span className="text-slate-500">Role:</span> <span className="font-bold text-amber-400">{selectedUser.role}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">Status:</span> <span className="text-emerald-400 font-bold">{selectedUser.status}</span></div>
            </div>
            <button onClick={() => setIsViewOpen(false)} className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-xl font-bold text-xs">Close</button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Edit User Account</h3>
              <button type="button" onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Full Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number</label>
                <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">System Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="DRIVER">DRIVER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 bg-[#0B5ED7] hover:bg-blue-700 py-2.5 rounded-xl font-bold text-xs text-white">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {isDeleteOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Delete User Account</h3>
              <p className="text-xs text-slate-400 mt-1">Are you sure you want to delete <span className="text-white font-bold">{selectedUser.name}</span>? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs">Cancel</button>
              <button onClick={handleDeleteUser} className="flex-1 bg-rose-600 hover:bg-rose-700 py-2.5 rounded-xl font-bold text-xs text-white">Delete User</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
