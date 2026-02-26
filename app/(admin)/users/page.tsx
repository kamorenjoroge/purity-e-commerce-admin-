"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { User } from "@/lib/types";
import { mockUsers } from "@/lib/mockData";

const emptyUser: Omit<User, "id"> = {
  name: "",
  email: "",
  password: "",
  role: "Editor",
  status: "active",
  joinedAt: new Date().toISOString().slice(0, 10),
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<User, "id">>(emptyUser);
  const [showForm, setShowForm] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyUser);
    setShowForm(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm(user);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editing) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editing.id ? { ...editing, ...form } : u
        )
      );
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...form,
      };
      setUsers((prev) => [...prev, newUser]);
    }

    setShowForm(false);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const setField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>

        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary-dark text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Form (Inline instead of Modal) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-card border border-border p-4 rounded-xl space-y-3"
        >
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            required
          />

          <select
            value={form.role}
            onChange={(e) =>
              setField("role", e.target.value as User["role"])
            }
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
          >
            <option>Super Admin</option>
            <option>Manager</option>
            <option>Editor</option>
          </select>

          <select
            value={form.status}
            onChange={(e) =>
              setField("status", e.target.value as User["status"])
            }
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg"
          >
            {editing ? "Update User" : "Add User"}
          </button>
        </form>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 hidden md:table-cell">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-border last:border-0 hover:bg-muted/50"
              >
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {u.email}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {u.role}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      u.status === "active"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => openEdit(u)}
                    className="text-primary"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-accent"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
