"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({ title }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // =========================
  // Get current user
  // =========================

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        }

      } catch (error) {
        console.error("Get user error:", error);
      }
    };

    getUser();
  }, []);

  // =========================
  // Sign out
  // =========================

  const signout = async () => {

    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const res = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      console.log("Signout response:", data);

      if (res.ok) {

        // انتقال به Login
        router.replace("/login");

        // Refresh برای پاک شدن state/server cache
        router.refresh();

      } else {

        console.error(
          "Logout failed:",
          data.message
        );

        setLoggingOut(false);
      }

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

      setLoggingOut(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >

      {/* Back */}

      <span
        style={{
          fontSize: 18,
          cursor: "pointer",
        }}
        onClick={() => router.back()}
      >
        ‹
      </span>


      {/* Title */}

      <h1
        style={{
          fontSize: 18,
          fontWeight: 600,
          margin: 0,
        }}
      >
        {title}
      </h1>


      {/* User + Logout */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >

        {user && (
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted, #94a3b8)",
              maxWidth: 100,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.name}
          </span>
        )}

        <button
          type="button"
          onClick={signout}
          disabled={loggingOut}
          title="خروج"
          style={{
            background: "none",
            border: "none",
            cursor: loggingOut
              ? "not-allowed"
              : "pointer",
            fontSize: 28,
            padding: 0,
            transform:'rotate(90deg)',
            opacity: loggingOut ? 0.5 : 1,
          }}
        >
          ⎋
        </button>

      </div>

    </div>
  );
}