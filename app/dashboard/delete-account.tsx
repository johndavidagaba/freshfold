"use client";

import { useState } from "react";
import styles from "./page.module.css";

const DELETE_ERROR =
  "We couldn't delete your account. Check your connection and try again.";

export function DeleteAccount() {
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/account/delete", { method: "POST" });

      if (!response.ok) {
        setSubmitting(false);
        setError(DELETE_ERROR);
        return;
      }

      window.location.assign("/account?form=login");
    } catch {
      setSubmitting(false);
      setError(DELETE_ERROR);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={`${styles.sectionTitle} type-title-medium`}>
        Delete my account
      </h2>

      {!confirming ? (
        <button
          type="button"
          className={`${styles.buttonDanger} type-label-large`}
          onClick={() => {
            setConfirming(true);
            setError("");
          }}
        >
          Delete my account
        </button>
      ) : (
        <div className={styles.confirm}>
          <p className={`${styles.text} type-body-medium`}>
            This deletes your account after 30 days. Continue?
          </p>

          <div className={styles.buttonRow}>
            <button
              type="button"
              disabled={submitting}
              className={`${styles.buttonDanger} type-label-large`}
              onClick={handleDelete}
            >
              {submitting ? "Deleting…" : "Confirm"}
            </button>
            <button
              type="button"
              disabled={submitting}
              className={`${styles.buttonSecondary} type-label-large`}
              onClick={() => {
                setConfirming(false);
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className={`${styles.error} type-body-small`}>
          {error}
        </p>
      )}
    </section>
  );
}
