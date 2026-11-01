import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { VerifyEmailForm } from "./verify-email-form";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Verify your email",
};

export default async function VerifyEmailPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/account?form=login");
  }

  if (user.emailVerifiedAt !== null) {
    redirect("/dashboard");
  }

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={`${styles.heading} type-headline-large`}>
          Verify your email
        </h1>
        <p className={`${styles.text} type-body-medium`}>
          We sent a 6-digit code to {user.email}. Enter it to use FreshFold.
        </p>

        <VerifyEmailForm email={user.email} />
      </section>
    </main>
  );
}
