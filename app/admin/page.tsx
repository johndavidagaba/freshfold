import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/account?form=login");
  }

  if (user.role !== "admin") {
    return (
      <main className={styles.container}>
        <section className={styles.card}>
          <h1 className={`${styles.heading} type-headline-large`}>403</h1>
          <p className={`${styles.text} type-body-large`}>
            You don&apos;t have access to this page.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={`${styles.heading} type-headline-large`}>Admin</h1>
        <h2 className={`${styles.subheading} type-title-medium`}>
          Lock customer account
        </h2>

        <form className={styles.form} action="/api/admin/lock" method="post">
          <div className={styles.field}>
            <label htmlFor="email" className={`${styles.label} type-label-large`}>
              Customer email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`${styles.input} type-body-large`}
              placeholder="customer@example.com"
            />
          </div>

          <button type="submit" className={`${styles.button} type-label-large`}>
            Lock account
          </button>
        </form>
      </section>
    </main>
  );
}
