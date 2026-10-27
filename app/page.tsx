import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Laundry pickup in Yaba · FreshFold",
  description:
    "FreshFold collects your laundry in Yaba, Lagos, records every item, and brings it back clean.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={`${styles.brand} type-headline-large`}>FreshFold</h1>
        <p className={`${styles.description} type-body-large`}>
          Laundry pickup and delivery in Yaba, Lagos.
        </p>
        <button
          type="button"
          className={`${styles.button} type-label-large`}
        >
          Schedule pickup
        </button>
      </section>
    </main>
  );
}
