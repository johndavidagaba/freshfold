import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { ChangePasswordForm } from "./change-password-form";
import { DeleteAccount } from "./delete-account";
import { LogoutButton } from "./logout-button";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/account?form=login");
  }

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={`${styles.heading} type-headline-large`}>
          Your dashboard
        </h1>
        <p className={`${styles.text} type-body-large`}>
          Logged in as {user.name} ({user.email})
        </p>

        {user.emailVerifiedAt === null && (
          <p className={`${styles.warning} type-body-medium`}>
            Please verify your email
          </p>
        )}

        <LogoutButton />
        <ChangePasswordForm />
        <DeleteAccount />
      </section>
    </main>
  );
}
