import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function InputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  rightElement,
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-white outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await register(username, email, password);
      setSuccess(data.message || "Registration successful.");
      setTimeout(() => navigate("/"), 900);
    } catch (submitError) {
      console.error(submitError);
      setError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020617] to-[#0F172A] px-4">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-[410px] rounded-xl border border-gray-700 bg-[#111827] px-5 py-5 text-left shadow-2xl sm:px-6 sm:py-5">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold tracking-[0.24em] text-gray-400">
            AutomateAI
          </p>
          <div className="flex justify-center py-0.5">
            <div className="group relative my-1.5">
              <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-indigo-500/35 to-purple-600/35 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-white/10 bg-slate-900/80 shadow-[0_16px_36px_rgba(99,102,241,0.3)]">
                <AutomationMonogram />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-[1.9rem] leading-none font-bold text-white">
              Create Account
            </h1>
            <p className="text-sm leading-5 text-gray-400">
              Start your smart job automation journey
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2.5">
            <InputField
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
            />

            <InputField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <InputField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 transition hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            <InputField
              id="confirm-password"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-gray-400 transition hover:text-white"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 text-white shadow-lg transition hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-white hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.75-7 10-7 10 7 10 7-3.75 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4 20 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M10.58 5.08A10.9 10.9 0 0 1 12 5c6.25 0 10 7 10 7a19.62 19.62 0 0 1-3.13 4.24M6.7 6.7C3.8 8.54 2 12 2 12a19.57 19.57 0 0 0 5.37 5.7A10.7 10.7 0 0 0 12 19c1.42 0 2.75-.27 3.97-.75"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AutomationMonogram() {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="automation-gradient-register" x1="8" y1="8" x2="40" y2="40">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#9333EA" />
        </linearGradient>
      </defs>
      <path
        d="M13 34 24 12l11 22"
        stroke="url(#automation-gradient-register)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 25.5h13"
        stroke="url(#automation-gradient-register)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="12" r="3.2" fill="url(#automation-gradient-register)" />
      <circle cx="13" cy="34" r="3.2" fill="url(#automation-gradient-register)" />
      <circle cx="35" cy="34" r="3.2" fill="url(#automation-gradient-register)" />
    </svg>
  );
}

export default Register;
