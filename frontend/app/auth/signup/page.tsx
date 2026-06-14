"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Step = "details" | "confirm";

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-orange-400" };
  if (score <= 3) return { score, label: "Good", color: "bg-yellow-400" };
  if (score <= 4) return { score, label: "Strong", color: "bg-primary" };
  return { score, label: "Very strong", color: "bg-primary" };
}

export default function SignupPage() {
  const [step, setStep] = useState<Step>("details");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const strength = getPasswordStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  function canProceedToConfirm() {
    return (
      fullName.trim().length > 0 &&
      companyName.trim().length > 0 &&
      email.includes("@") &&
      password.length >= 6 &&
      passwordsMatch &&
      agreed
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
          phone,
        },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <Link
          href="/"
          className="mb-8 text-lg font-semibold tracking-tight text-text-primary"
        >
          Catch<span className="text-primary">Am</span>
        </Link>
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-7 w-7 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="mb-3 text-2xl font-semibold text-text-primary">
            Check your email
          </h1>
          <p className="text-sm leading-relaxed text-text-secondary">
            We sent a confirmation link to{" "}
            <span className="text-text-primary">{email}</span>. Click it to
            activate your account and access the enterprise dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => {
                setSent(false);
                setStep("details");
                setFullName("");
                setCompanyName("");
                setEmail("");
                setPhone("");
                setPassword("");
                setConfirmPassword("");
                setAgreed(false);
              }}
              className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm text-text-secondary transition-colors hover:border-primary hover:text-text-primary"
            >
              Use a different email
            </button>
            <Link
              href="/auth/login"
              className="text-sm text-primary hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link
        href="/"
        className="mb-8 text-lg font-semibold tracking-tight text-text-primary"
      >
        Catch<span className="text-primary">Am</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold text-text-primary">
            Create your enterprise account
          </h1>
          <p className="text-sm text-text-secondary">
            24/7 monitoring. Real-time alerts. Forensic evidence.
          </p>
        </div>

        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                step === "details"
                  ? "bg-primary text-white"
                  : "bg-surface text-text-muted"
              }`}
            >
              1
            </div>
            <span
              className={`text-sm ${
                step === "details" ? "text-text-primary" : "text-text-muted"
              }`}
            >
              Details
            </span>
          </div>
          <div className="mx-2 h-px w-8 bg-border" />
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                step === "confirm"
                  ? "bg-primary text-white"
                  : "bg-surface text-text-muted"
              }`}
            >
              2
            </div>
            <span
              className={`text-sm ${
                step === "confirm" ? "text-text-primary" : "text-text-muted"
              }`}
            >
              Confirm
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <form
            onSubmit={
              step === "details"
                ? (e) => {
                    e.preventDefault();
                    if (canProceedToConfirm()) setStep("confirm");
                  }
                : handleSubmit
            }
            className="flex flex-col gap-4"
          >
            {step === "details" && (
              <>
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block text-sm text-text-secondary"
                  >
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-border bg-bg-primary px-4 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                    placeholder="Samuel Husseini"
                  />
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="mb-1.5 block text-sm text-text-secondary"
                  >
                    Company or brand name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-border bg-bg-primary px-4 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                    placeholder="Acme Corp Ltd"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm text-text-secondary"
                  >
                    Work email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-xl border border-border bg-bg-primary px-4 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm text-text-secondary"
                  >
                    Phone number{" "}
                    <span className="text-text-muted">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 w-full rounded-xl border border-border bg-bg-primary px-4 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                    placeholder="+234 800 000 0000"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm text-text-secondary"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full rounded-xl border border-border bg-bg-primary px-4 pr-12 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-bg-primary">
                          <div
                            className={`h-full rounded-full transition-all ${strength.color}`}
                            style={{
                              width: `${(strength.score / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-text-muted">
                          {strength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm text-text-secondary"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`h-12 w-full rounded-xl border bg-bg-primary px-4 text-sm text-text-primary outline-none transition-colors focus:border-primary ${
                      confirmPassword.length > 0 && !passwordsMatch
                        ? "border-red-500/50"
                        : "border-border"
                    }`}
                    placeholder="Re-enter your password"
                  />
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="mt-1.5 text-xs text-red-400">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="mt-1">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                    />
                    <span className="text-xs leading-relaxed text-text-secondary">
                      I agree to the{" "}
                      <span className="text-text-primary">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-text-primary">
                        Privacy Policy
                      </span>
                      . I understand my data will be processed in accordance
                      with Nigeria&apos;s Data Protection Regulation.
                    </span>
                  </label>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={!canProceedToConfirm()}
                  className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-primary text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </>
            )}

            {step === "confirm" && (
              <>
                <div className="rounded-xl bg-bg-primary p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                    Account details
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Name</span>
                      <span className="text-sm text-text-primary">
                        {fullName}
                      </span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">
                        Company
                      </span>
                      <span className="text-sm text-text-primary">
                        {companyName}
                      </span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">
                        Email
                      </span>
                      <span className="text-sm text-text-primary">{email}</span>
                    </div>
                    {phone && (
                      <>
                        <div className="h-px bg-border" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">
                            Phone
                          </span>
                          <span className="text-sm text-text-primary">
                            {phone}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-border text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-text-primary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-primary text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
