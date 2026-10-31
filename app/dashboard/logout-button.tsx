"use client";

import { useState } from "react";
import styles from "./page.module.css";

const LOGOUT_ERROR =
  "We couldn't log you out. Check your connection and try again.";

export function LogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoggingOut(true);
    setError("");

    try {
      const res = await fetch("/api/logout", { method: "POST" });

      if (!res.ok) {
        setLoggingOut(false);
        setError(LOGOUT_ERROR);
        return;
      }

      window.location.assign("/account?form=login");
    } catch {
      setLoggingOut(false);
      setError(LOGOUT_ERROR);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={loggingOut}
        className={`${styles.button} type-label-large`}
        onClick={handleLogout}
      >
        {loggingOut ? "Logging out…" : "Log out"}
      </button>

      {error && (
        <p className={`${styles.error} type-body-medium`} role="alert">
          {error}
        </p>
      )}
    </>
  );
}
