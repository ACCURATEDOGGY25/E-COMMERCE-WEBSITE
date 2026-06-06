"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { api, ApiError } from "@/lib/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string | null;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, token, fetchUser } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profile, setProfile] = useState({ name: "", currentPassword: "", newPassword: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/account");
      return;
    }
    fetchUser();
    api<{ data: Notification[]; unreadCount: number }>("/api/notifications", { token })
      .then((res) => setNotifications(res.data))
      .catch(() => {});
  }, [token, fetchUser, router]);

  useEffect(() => {
    if (user) setProfile((p) => ({ ...p, name: user.name }));
  }, [user]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setProfileErr("");
    setProfileMsg("");
    try {
      const body: Record<string, string> = {};
      if (profile.name && profile.name !== user?.name) body.name = profile.name;
      if (profile.newPassword) {
        body.currentPassword = profile.currentPassword;
        body.newPassword = profile.newPassword;
      }
      if (!Object.keys(body).length) {
        setProfileMsg("No changes to save.");
        return;
      }
      await api("/api/auth/me", { method: "PATCH", token, body: JSON.stringify(body) });
      await fetchUser();
      setProfileMsg("Profile updated.");
      setProfile({ name: user?.name || profile.name, currentPassword: "", newPassword: "" });
    } catch (err) {
      setProfileErr(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function markAllRead() {
    if (!token) return;
    await api("/api/notifications/read-all", { method: "PATCH", token });
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  }

  if (!token) return null;
  if (!user) {
    return <p className="p-16 text-center text-gray-500">Loading account...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">My Account</h1>

      <div className="card mt-8 p-6">
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="font-medium capitalize">{user.role.toLowerCase()}</dd>
          </div>
          {user.vendor && (
            <div>
              <dt className="text-sm text-gray-500">Store</dt>
              <dd className="font-medium">
                {user.vendor.storeName}{" "}
                <span className="text-sm text-gray-500">({user.vendor.status})</span>
              </dd>
            </div>
          )}
        </dl>
      </div>

      <form onSubmit={saveProfile} className="card mt-8 space-y-4 p-6">
        <h2 className="font-semibold">Edit profile</h2>
        <div>
          <label className="text-sm font-medium">Display name</label>
          <input
            className="input mt-1"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">New password</label>
          <input
            type="password"
            className="input mt-1"
            placeholder="Leave blank to keep current"
            value={profile.newPassword}
            onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
          />
        </div>
        {profile.newPassword && (
          <div>
            <label className="text-sm font-medium">Current password</label>
            <input
              type="password"
              className="input mt-1"
              value={profile.currentPassword}
              onChange={(e) =>
                setProfile({ ...profile, currentPassword: e.target.value })
              }
              required
            />
          </div>
        )}
        {profileErr && <p className="text-sm text-red-600">{profileErr}</p>}
        {profileMsg && <p className="text-sm text-green-600">{profileMsg}</p>}
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      <div className="card mt-8 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Notifications</h2>
          {notifications.some((n) => !n.read) && (
            <button type="button" onClick={markAllRead} className="text-sm text-primary-600">
              Mark all read
            </button>
          )}
        </div>
        <ul className="mt-4 space-y-3">
          {notifications.length === 0 ? (
            <li className="text-sm text-gray-500">No notifications yet.</li>
          ) : (
            notifications.map((n) => (
              <li
                key={n.id}
                className={`rounded-lg border p-3 ${n.read ? "bg-white" : "bg-primary-50/50"}`}
              >
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
                {n.link && (
                  <Link href={n.link} className="mt-1 inline-block text-sm text-primary-600">
                    View →
                  </Link>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/orders" className="card p-4 transition hover:shadow-md">
          <h3 className="font-semibold">Order History</h3>
          <p className="text-sm text-gray-500">View and track your orders</p>
        </Link>
        <Link href="/wishlist" className="card p-4 transition hover:shadow-md">
          <h3 className="font-semibold">Wishlist</h3>
          <p className="text-sm text-gray-500">Saved items for later</p>
        </Link>
      </div>
    </div>
  );
}
