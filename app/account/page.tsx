"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

type FormKind = "signup" | "login" | "reset";

type SignupValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type SignupTouched = {
  name: boolean;
  email: boolean;
  phone: boolean;
  password: boolean;
};

const FORM_TITLES: Record<FormKind, string> = {
  signup: "Sign up · FreshFold",
  login: "Log in · FreshFold",
  reset: "Reset password · FreshFold",
};

function resolveForm(value: string | null): FormKind {
  return value === "signup" || value === "reset" ? value : "login";
}

function isValidName(value: string): boolean {
  const trimmed = value.trim();
  const length = Array.from(trimmed).length;

  if (length < 2 || length > 60) return false;
  if (!/^[\p{L} .'-]+$/u.test(trimmed)) return false;

  return (trimmed.match(/\p{L}/gu) ?? []).length >= 2;
}

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();

  if (trimmed.length === 0 || trimmed.length > 254) return false;
  if (/\s/.test(trimmed)) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function isValidPhone(value: string): boolean {
  const normalized = value.replace(/[\s-]/g, "");

  return (
    /^(070|080|081|090|091)\d{8}$/.test(normalized) ||
    /^\+234[1-9]\d{9}$/.test(normalized)
  );
}

function isValidPassword(value: string): boolean {
  const length = Array.from(value).length;

  return length >= 12 && length <= 128 && value.trim().length > 0;
}

function SignupForm() {
  const [values, setValues] = useState<SignupValues>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [touched, setTouched] = useState<SignupTouched>({
    name: false,
    email: false,
    phone: false,
    password: false,
  });
  const [termsChecked, setTermsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateValue = (field: keyof SignupValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const markTouched = (field: keyof SignupTouched) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const isSignupValid =
    isValidName(values.name) &&
    isValidEmail(values.email) &&
    isValidPhone(values.phone) &&
    isValidPassword(values.password) &&
    termsChecked;

  const nameError =
    touched.name && values.name.trim() === ""
      ? "Add your name so we can tag your bag."
      : touched.name && !isValidName(values.name)
        ? "Use letters only, 2 to 60 characters."
        : "";

  const emailEmpty = touched.email && values.email.trim() === "";
  const emailCheck = values.email.includes("@") || touched.email;
  const emailError = emailEmpty
    ? "Add your email; it's how you log in."
    : emailCheck && !isValidEmail(values.email)
      ? "That doesn't look like an email address."
      : "";

  const phoneError =
    touched.phone && values.phone.trim() === ""
      ? "Add a phone number so the rider can reach you."
      : touched.phone && !isValidPhone(values.phone)
        ? "Enter a Nigerian mobile number, e.g. 080…"
        : "";

  const passwordError =
    touched.password && values.password.trim() === ""
      ? "Choose a password to protect your account."
      : "";
  const showPasswordHint = !passwordError && values.password.length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignupValid) {
      console.log("valid");
    }
  };

  return (
    <>
      <h1 className={`${styles.heading} type-headline-large`}>
        Create your account
      </h1>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="name" className={`${styles.label} type-label-large`}>
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            onBlur={() => markTouched("name")}
            className={`${styles.input} type-body-large`}
            placeholder="e.g. Tunde Adebayo"
          />
          {nameError && (
            <p className={`${styles.error} type-body-small`}>{nameError}</p>
          )}
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
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            onBlur={() => markTouched("email")}
            className={`${styles.input} type-body-large`}
            placeholder="you@example.com"
          />
          {emailError && (
            <p className={`${styles.error} type-body-small`}>{emailError}</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="phone" className={`${styles.label} type-label-large`}>
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => updateValue("phone", event.target.value)}
            onBlur={() => markTouched("phone")}
            className={`${styles.input} type-body-large`}
            placeholder="e.g. 08012345678"
          />
          {phoneError && (
            <p className={`${styles.error} type-body-small`}>{phoneError}</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={`${styles.label} type-label-large`}>
            Password
          </label>
          <div className={styles.passwordRow}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={values.password}
              onChange={(event) => updateValue("password", event.target.value)}
              onBlur={() => markTouched("password")}
              className={`${styles.input} ${styles.passwordInput} type-body-large`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className={`${styles.toggleButton} type-label-large`}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {passwordError && (
            <p className={`${styles.error} type-body-small`}>{passwordError}</p>
          )}
          {showPasswordHint && (
            <p className={`${styles.hint} type-body-small`}>
              At least 12 characters
            </p>
          )}
        </div>

        <div className={styles.checkboxRow}>
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            checked={termsChecked}
            onChange={(event) => setTermsChecked(event.target.checked)}
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

        {isSignupValid && (
          <button type="submit" className={`${styles.button} type-label-large`}>
            Create account
          </button>
        )}
      </form>
    </>
  );
}

function LoginForm() {
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const nextErrors = {
      email: isValidEmail(email)
        ? ""
        : "That doesn't look like an email address.",
      password: password.trim() === "" ? "Enter your password." : "",
    };

    setErrors(nextErrors);

    if (!nextErrors.email && !nextErrors.password) {
      console.log("valid");
    }
  };

  return (
    <>
      <h1 className={`${styles.heading} type-headline-large`}>Welcome back</h1>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
          {errors.email && (
            <p className={`${styles.error} type-body-small`}>{errors.email}</p>
          )}
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
          {errors.password && (
            <p className={`${styles.error} type-body-small`}>{errors.password}</p>
          )}
        </div>

        <button type="submit" className={`${styles.button} type-label-large`}>
          Log in
        </button>
      </form>
    </>
  );
}

function ResetForm() {
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const nextError = isValidEmail(email)
      ? ""
      : "That doesn't look like an email address.";

    setError(nextError);

    if (!nextError) {
      console.log("valid");
    }
  };

  return (
    <>
      <h1 className={`${styles.heading} type-headline-large`}>
        Reset your password
      </h1>
      <p className={`${styles.intro} type-body-medium`}>
        Enter the email you use for FreshFold and we will send you a reset link.
      </p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
          {error && (
            <p className={`${styles.error} type-body-small`}>{error}</p>
          )}
        </div>

        <button type="submit" className={`${styles.button} type-label-large`}>
          Send reset link
        </button>
      </form>
    </>
  );
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
        {activeForm === "signup" && <SignupForm />}
        {activeForm === "login" && <LoginForm />}
        {activeForm === "reset" && <ResetForm />}

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
