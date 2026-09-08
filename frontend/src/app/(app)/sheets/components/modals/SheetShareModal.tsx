"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Users, 
  UserPlus, 
  Trash2, 
  Copy, 
  Check, 
  Mail 
} from "lucide-react";
import { SyncedSheetItem, SharedUser, PermissionLevel } from "../../types";

interface SheetShareModalProps {
  sheet: SyncedSheetItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSharedUsers: (sheetId: string, users: SharedUser[]) => void;
}

export default function SheetShareModal({
  sheet,
  isOpen,
  onClose,
  onUpdateSharedUsers,
}: SheetShareModalProps) {
  const [users, setUsers] = useState<SharedUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPermission, setNewPermission] = useState<PermissionLevel>("edit");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sheet) {
      setUsers(sheet.sharedUsers || []);
    }
  }, [sheet]);

  if (!isOpen || !sheet) return null;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) return;

    const newUser: SharedUser = {
      id: `usr-${Date.now()}`,
      email: newEmail.trim(),
      name: newEmail.split("@")[0],
      permission: newPermission,
      addedAt: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    setUsers(updated);
    onUpdateSharedUsers(sheet.id, updated);
    setNewEmail("");
  };

  const handleRemoveUser = (userId: string) => {
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    onUpdateSharedUsers(sheet.id, updated);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sheet.sheetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#1a1f2e] border border-slate-700/80 shadow-2xl p-5 sm:p-6 my-8 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Kelola Akses & Kolaborator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {sheet.sheetTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add User Form */}
        <form onSubmit={handleAddUser} className="py-4 space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            Undang Kolaborator Google Account:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="rekan.bisnis@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={newPermission}
              onChange={(e) => setNewPermission(e.target.value as PermissionLevel)}
              className="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="edit">Editor</option>
              <option value="view">Viewer</option>
            </select>
            <button
              type="submit"
              disabled={!newEmail.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Undang</span>
            </button>
          </div>
        </form>

        {/* Active Collaborators List */}
        <div className="space-y-2 mb-4">
          <div className="text-xs font-semibold text-slate-400">Pengguna dengan Akses:</div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-[11px] shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 truncate">{user.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    user.permission === "owner"
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : user.permission === "edit"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}>
                    {user.permission.toUpperCase()}
                  </span>

                  {user.permission !== "owner" && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Cabut Akses"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copy Public/Team Link */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2">
          <div className="truncate text-xs text-slate-400">
            <span className="font-semibold text-slate-300 block mb-0.5">Tautan Langsung Spreadsheet</span>
            <span className="font-mono text-[10px] truncate block text-slate-500">{sheet.sheetUrl}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Tersalin!" : "Salin"}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 mt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
