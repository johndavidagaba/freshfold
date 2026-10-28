import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your FreshFold account to see your orders and monthly plan.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={`${styles.heading} type-headline-large`}>Welcome back</h1>
        <p className={`${styles.intro} type-body-medium`}>
          Log in to see your orders and how much of your monthly plan is left.
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

          <div className={styles.field}>
            <label htmlFor="password" className={`${styles.label} type-label-large`}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={`${styles.input} type-body-large`}
            />
          </div>

          <button type="submit" className={`${styles.button} type-label-large`}>
            Log in
          </button>
        </form>

        <nav className={styles.links} aria-label="Other account pages">
          <Link href="/signup" className={`${styles.link} type-label-large`}>
            Create an account
          </Link>
          <Link href="/reset-password" className={`${styles.link} type-label-large`}>
            Reset password
          </Link>
        </nav>
      </section>
    </main>
  );
}
