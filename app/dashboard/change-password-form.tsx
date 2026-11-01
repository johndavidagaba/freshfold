"use client";

import { useState } from "react";
import styles from "./page.module.css";

type ApiErrorResponse = {
  error?: string;
  errors?: Record<string, string[] | undefined>;
};

function firstFieldErrors(
  errors: Record<string, string[] | undefined> | undefined
): Record<string, string> {
  const result: Record<string, string> = {};

  if (!errors) return result;

  for (const [field, messages] of Object.entries(errors)) {
    if (messages && messages.length > 0) {
      result[field] = messages[0];
    }
  }

  return result;
}

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentPasswordError("");
    setNewPasswordError("");
    setFormError("");
    setStatus("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await response.json()) as ApiErrorResponse;

      if (!response.ok) {
        const fieldErrors = firstFieldErrors(data.errors);

        setCurrentPasswordError(fieldErrors.currentPassword ?? "");
        setNewPasswordError(fieldErrors.newPassword ?? "");
        setFormError(
          data.error ??
            (fieldErrors.currentPassword || fieldErrors.newPassword
              ? ""
              : "Something went wrong. Try again.")
        );
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setStatus("Password changed. You've been logged out everywhere else.");
    } catch {
      setFormError(
        "We couldn't change your password. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={`${styles.sectionTitle} type-title-medium`}>
        Change password
      </h2>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label
            htmlFor="currentPassword"
            className={`${styles.label} type-label-large`}
          >
            Current password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            aria-invalid={currentPasswordError ? true : undefined}
            aria-describedby={
              currentPasswordError ? "currentPassword-error" : undefined
            }
            className={`${styles.input} type-body-large`}
          />
          {currentPasswordError && (
            <p
              id="currentPassword-error"
              role="alert"
              className={`${styles.error} type-body-small`}
            >
              {currentPasswordError}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label
            htmlFor="newPassword"
            className={`${styles.label} type-label-large`}
          >
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            aria-invalid={newPasswordError ? true : undefined}
            aria-describedby={
              newPasswordError ? "newPassword-error" : undefined
            }
            className={`${styles.input} type-body-large`}
          />
          {newPasswordError && (
            <p
              id="newPassword-error"
              role="alert"
              className={`${styles.error} type-body-small`}
            >
              {newPasswordError}
            </p>
          )}
        </div>

        {formError && (
          <p role="alert" className={`${styles.error} type-body-small`}>
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`${styles.button} type-label-large`}
        >
          {submitting ? "Changing…" : "Change password"}
        </button>

        {status && (
          <p role="status" className={`${styles.status} type-body-medium`}>
            {status}
          </p>
        )}
      </form>
    </section>
  );
}
