"use client";

import { useEffect, useState, useRef } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  targetRole: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationBellProps {
  defaultTenantId?: string;
  defaultRole?: string;
  defaultUserId?: string;
}

export default function NotificationBell({
  defaultTenantId = "6676aa9ae9a701309909dcda",
  defaultRole = "ROLE_EMPLOYEE",
  defaultUserId = "employee",
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to read cookies
  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  // Parse JWT details
  function getAuthDetails() {
    const token = getCookie("routeSessionToken");
    if (!token) {
      return { tenantId: defaultTenantId, role: defaultRole, userId: defaultUserId, token: null };
    }
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      return {
        tenantId: payload.tenantId || defaultTenantId,
        role: payload.role || defaultRole,
        userId: payload.sub || defaultUserId,
        token: token,
      };
    } catch (e) {
      return { tenantId: defaultTenantId, role: defaultRole, userId: defaultUserId, token: null };
    }
  }

  const { tenantId, role, userId, token } = getAuthDetails();

  // Fetch notifications history
  const fetchNotifications = async () => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      headers["X-Tenant-Id"] = tenantId;
      headers["X-User-Role"] = role;
      headers["X-User-Id"] = userId;

      const res = await fetch("http://localhost:8080/api/v1/notifications", {
        headers,
      });
      if (res.ok) {
        const body = await res.json();
        const list = body.data || [];
        setNotifications(list);
        setUnreadCount(list.filter((n: Notification) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications history:", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      headers["X-Tenant-Id"] = tenantId;
      headers["X-User-Role"] = role;
      headers["X-User-Id"] = userId;

      const res = await fetch(`http://localhost:8080/api/v1/notifications/${id}/read`, {
        method: "PUT",
        headers,
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const wsUrl = `ws://localhost:8080/api/v1/notifications/ws?tenantId=${encodeURIComponent(
      tenantId
    )}&role=${encodeURIComponent(role)}&userId=${encodeURIComponent(userId)}`;
    
    console.log("Connecting to WebSocket:", wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const newNotif: Notification = JSON.parse(event.data);
        console.log("Received live notification via WebSocket:", newNotif);
        
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((c) => c + 1);

        if (Notification.permission === "granted") {
          new Notification(newNotif.title, { body: newNotif.message });
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    ws.onopen = () => {
      console.log("WebSocket connection established successfully.");
    };

    ws.onerror = (err) => {
      console.warn("WebSocket connection error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <span className="font-semibold text-sm text-gray-800">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-gray-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                  className={`p-4 hover:bg-gray-50/50 transition-colors cursor-pointer flex gap-3 ${
                    !notif.isRead ? "bg-blue-50/10" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className={`text-xs font-semibold truncate ${!notif.isRead ? "text-gray-900" : "text-gray-500"}`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-1">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
