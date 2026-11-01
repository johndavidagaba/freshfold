"use client";

import { useState } from "react";
import { LogoutButton } from "@/app/dashboard/logout-button";
import styles from "./page.module.css";

type ApiErrorResponse = {
  error?: string;
  errors?: Record<string, string[] | undefined>;
};

export function VerifyEmailForm({ email }: { email: string }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
        }),
      });
      const data = (await response.json()) as ApiErrorResponse;

      if (response.ok) {
        window.location.assign("/dashboard");
        return;
      }

      setError(
        data.errors?.code?.[0] ??
          data.errors?.email?.[0] ??
          data.error ??
          "Something went wrong. Try again."
      );
    } catch {
      setError(
        "We couldn't verify your email. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label
            htmlFor="verificationCode"
            className={`${styles.label} type-label-large`}
          >
            6-digit code
          </label>
          <input
            id="verificationCode"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "verification-error" : undefined}
            aria-required="true"
            className={`${styles.input} type-body-large`}
          />
        </div>

        {error && (
          <p
            id="verification-error"
            role="alert"
            className={`${styles.error} type-body-small`}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`${styles.button} type-label-large`}
        >
          {submitting ? "Verifying…" : "Verify"}
        </button>
      </form>

      <LogoutButton />
    </>
  );
}
