import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a FreshFold account to book laundry pickups in Yaba, Lagos.",
  alternates: {
    canonical: "/signup",
  },
};

export default function SignupPage() {
  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={`${styles.heading} type-headline-large`}>
          Create your account
        </h1>
        <p className={`${styles.intro} type-body-medium`}>
          One account for pickups, balances and your monthly plan.
        </p>

        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name" className={`${styles.label} type-label-large`}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className={`${styles.input} type-body-large`}
              placeholder="e.g. Tunde Adebayo"
            />
          </div>

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
            <label htmlFor="phone" className={`${styles.label} type-label-large`}>
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={`${styles.input} type-body-large`}
              placeholder="e.g. 08012345678"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="address" className={`${styles.label} type-label-large`}>
              Pickup Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              className={`${styles.input} type-body-large`}
              placeholder="e.g. 14 Commercial Ave, Yaba"
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
              autoComplete="new-password"
              className={`${styles.input} type-body-large`}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={`${styles.label} type-label-large`}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={`${styles.input} type-body-large`}
            />
          </div>

          <button type="submit" className={`${styles.button} type-label-large`}>
            Create account
          </button>
        </form>

        <nav className={styles.links} aria-label="Other account pages">
          <Link href="/login" className={`${styles.link} type-label-large`}>
            Log in
          </Link>
          <Link href="/reset-password" className={`${styles.link} type-label-large`}>
            Reset password
          </Link>
        </nav>
      </section>
    </main>
  );
}
