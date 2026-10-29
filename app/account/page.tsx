"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

type FormKind = "signup" | "login" | "reset";

const FORM_TITLES: Record<FormKind, string> = {
  signup: "Sign up · FreshFold",
  login: "Log in · FreshFold",
  reset: "Reset password · FreshFold",
};

function resolveForm(value: string | null): FormKind {
  return value === "signup" || value === "reset" ? value : "login";
}

function AccountForms() {
  const searchParams = useSearchParams();
  const [activeForm, setActiveForm] = useState<FormKind>(() =>
    resolveForm(searchParams.get("form"))
  );

  useEffect(() => {
    document.title = FORM_TITLES[activeForm];
  }, [activeForm]);

  const handleFormClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    form: FormKind
  ) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    setActiveForm(form);
    window.history.replaceState(null, "", `/account?form=${form}`);
  };

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        {activeForm === "signup" && (
          <>
            <h1 className={`${styles.heading} type-headline-large`}>
              Create your account
            </h1>

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

              <div className={styles.checkboxRow}>
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className={styles.checkbox}
                />
                <label htmlFor="terms" className={`${styles.checkboxLabel} type-body-medium`}>
                  I agree to FreshFold&apos;s{" "}
                  <Link href="/terms" className={styles.link}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className={styles.link}>
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <button type="submit" className={`${styles.button} type-label-large`}>
                Create account
              </button>
            </form>
          </>
        )}

        {activeForm === "login" && (
          <>
            <h1 className={`${styles.heading} type-headline-large`}>Welcome back</h1>

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
          </>
        )}

        {activeForm === "reset" && (
          <>
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
          </>
        )}

        <nav className={styles.links} aria-label="Other account pages">
          {activeForm !== "login" && (
            <Link
              href="/account?form=login"
              onClick={(event) => handleFormClick(event, "login")}
              className={`${styles.link} type-label-large`}
            >
              Log in
            </Link>
          )}
          {activeForm !== "signup" && (
            <Link
              href="/account?form=signup"
              onClick={(event) => handleFormClick(event, "signup")}
              className={`${styles.link} type-label-large`}
            >
              Create an account
            </Link>
          )}
          {activeForm !== "reset" && (
            <Link
              href="/account?form=reset"
              onClick={(event) => handleFormClick(event, "reset")}
              className={`${styles.link} type-label-large`}
            >
              Reset password
            </Link>
          )}
        </nav>
      </section>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.container}>
          <section className={styles.card} />
        </main>
      }
    >
      <AccountForms />
    </Suspense>
  );
}
