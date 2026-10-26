"use client";

import { useActionState } from "react";
import { schedulePickupAction, type ScheduleFormState } from "./actions";
import styles from "./page.module.css";

const initialState: ScheduleFormState = {};

export default function SchedulePage() {
  const [state, formAction, isPending] = useActionState(
    schedulePickupAction,
    initialState
  );

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={`${styles.heading} type-headline-small`}>
          Schedule a pickup
        </h1>

        {state?.success ? (
          <div className={styles.successCard}>
            <h2 className={`${styles.successTitle} type-title-medium`}>
              Pickup scheduled!
            </h2>
            <p className={`${styles.successText} type-body-medium`}>
              Your request has been recorded. Reference ID: {state.requestId}
            </p>
          </div>
        ) : (
          <form action={formAction} className={styles.form}>
            {state?.error && (
              <p
                className="type-body-small"
                style={{ color: "var(--color-error)" }}
              >
                {state.error}
              </p>
            )}

            <div className={styles.field}>
              <label htmlFor="customerName" className={`${styles.label} type-label-large`}>
                Full Name
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                required
                className={styles.input}
                placeholder="e.g. Tunde Adebayo"
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
                required
                className={styles.input}
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
                required
                className={styles.input}
                placeholder="e.g. 14 Commercial Ave, Yaba"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="pickupDate" className={`${styles.label} type-label-large`}>
                Pickup Date &amp; Time
              </label>
              <input
                id="pickupDate"
                name="pickupDate"
                type="datetime-local"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="itemCount" className={`${styles.label} type-label-large`}>
                Rough Item Count
              </label>
              <input
                id="itemCount"
                name="itemCount"
                type="number"
                min="1"
                required
                className={styles.input}
                placeholder="e.g. 7"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`${styles.button} type-label-large`}
            >
              {isPending ? "Submitting..." : "Request pickup"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
