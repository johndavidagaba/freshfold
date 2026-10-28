import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a password reset link for your FreshFold account.",
  alternates: {
    canonical: "/reset-password",
  },
};

export default function ResetPasswordPage() {
  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={`${styles.heading} type-headline-large`}>
          Reset your password
        </h1>
        <p className={`${styles.intro} type-body-medium`}>
          Enter the email you use for FreshFold and we will send you a reset link.
        </p>

        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={`${styles.label} type-label-large`}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={`${styles.input} type-body-large`}
              placeholder="you@example.com"
            />
          </div>

          <button type="submit" className={`${styles.button} type-label-large`}>
            Send reset link
          </button>
        </form>

        <nav className={styles.links} aria-label="Other account pages">
          <Link href="/login" className={`${styles.link} type-label-large`}>
            Log in
          </Link>
          <Link href="/signup" className={`${styles.link} type-label-large`}>
            Create an account
          </Link>
        </nav>
      </section>
    </main>
  );
}
