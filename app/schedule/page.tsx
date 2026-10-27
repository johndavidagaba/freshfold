"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { schedulePickupAction, type ScheduleFormState } from "./actions";
import styles from "./page.module.css";

const initialState: ScheduleFormState = {};

const WINDOWS = [
  { id: "morning", label: "Morning (8–12)" },
  { id: "afternoon", label: "Afternoon (12–4)" },
  { id: "evening", label: "Evening (4–7)" },
] as const;

export default function SchedulePage() {
  const [state, formAction, isPending] = useActionState(
    schedulePickupAction,
    initialState
  );

  const [selectedWindow, setSelectedWindow] = useState<string>("");
  const [windowError, setWindowError] = useState<string>("");

  const handleWindowSelect = (windowId: string) => {
    setSelectedWindow(windowId);
    setWindowError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!selectedWindow) {
      e.preventDefault();
      setWindowError("Please choose a pickup window.");
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.brandLink}>
          <Image
            src="/icon.png"
            width={32}
            height={32}
            alt="FreshFold home"
          />
          <span className={`${styles.brandName} type-title-medium`}>
            FreshFold
          </span>
        </Link>
      </header>

      <section className={styles.card}>
        <h1 className={`${styles.heading} type-headline-large`}>
          We count every item. Book your pickup.
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
          <form
            action={formAction}
            onSubmit={handleSubmit}
            className={styles.form}
          >
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
                Pickup Date
              </label>
              <input
                id="pickupDate"
                name="pickupDate"
                type="date"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <span className={`${styles.label} type-label-large`}>
                Pickup Window
              </span>
              <div className={styles.windowButtonGroup}>
                {WINDOWS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleWindowSelect(w.id)}
                    className={
                      selectedWindow === w.id
                        ? styles.windowButtonSelected
                        : styles.windowButton
                    }
                  >
                    {w.label}
                  </button>
                ))}
              </div>
              {windowError && (
                <p className={`${styles.windowErrorMessage} type-body-small`}>
                  {windowError}
                </p>
              )}
              <input
                type="hidden"
                name="pickupWindow"
                value={selectedWindow}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={styles.button}
            >
              {isPending ? "Submitting..." : "Request pickup"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
