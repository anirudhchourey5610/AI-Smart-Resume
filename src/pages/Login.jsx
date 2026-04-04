import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login: setAuthToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await login(email, password);
      setAuthToken(data.token);
      navigate("/dashboard");
    } catch (submitError) {
      console.error(submitError);
      setError("Invalid credentials. Please try again.");
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
              Welcome Back
            </h1>
            <p className="text-sm leading-5 text-gray-400">
              Access your smart job automation system
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2.5">
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
              placeholder="Enter your password"
              autoComplete="current-password"
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
          </div>

          <div className="flex items-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2 text-gray-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 text-white shadow-lg transition hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-white hover:text-indigo-300"
          >
            Create one
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21.81 12.23c0-.68-.06-1.18-.19-1.7H12v3.35h5.65c-.11.83-.7 2.08-2.02 2.92l-.02.11 2.93 2.26.2.02c1.82-1.67 3.07-4.13 3.07-6.96Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.08-.91 6.77-2.48l-3.22-2.5c-.86.6-2.01 1.03-3.55 1.03-2.7 0-4.99-1.77-5.81-4.23l-.1.01-3.04 2.35-.03.09A10.22 10.22 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.19 13.82A6.12 6.12 0 0 1 5.86 12c0-.63.12-1.24.32-1.82l-.01-.12L3.1 7.68l-.1.05A9.94 9.94 0 0 0 2 12c0 1.55.37 3.02 1 4.27l3.19-2.45Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.95c1.94 0 3.25.83 4 1.53l2.92-2.84C17.07 2.92 14.76 2 12 2A10.22 10.22 0 0 0 3 7.73l3.19 2.45C7.02 7.72 9.31 5.95 12 5.95Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5a12 12 0 0 0-3.8 23.38c.6.1.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.54-1.37-1.33-1.74-1.33-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.82 1.22 1.82 1.22 1.06 1.82 2.78 1.3 3.46 1 .1-.77.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.9 0-1.3.47-2.36 1.22-3.2-.12-.3-.53-1.53.12-3.2 0 0 1-.32 3.3 1.22a11.44 11.44 0 0 1 6 0c2.3-1.54 3.3-1.22 3.3-1.22.65 1.67.24 2.9.12 3.2.75.84 1.22 1.9 1.22 3.2 0 4.58-2.82 5.6-5.5 5.9.44.38.82 1.1.82 2.24v3.31c0 .32.22.7.82.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function AutomationMonogram() {
  return (
    <svg width="42" height="42" viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="automation-gradient" x1="8" y1="8" x2="40" y2="40">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#9333EA" />
        </linearGradient>
      </defs>
      <path
        d="M13 34 24 12l11 22"
        stroke="url(#automation-gradient)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 25.5h13"
        stroke="url(#automation-gradient)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="12" r="3.2" fill="url(#automation-gradient)" />
      <circle cx="13" cy="34" r="3.2" fill="url(#automation-gradient)" />
      <circle cx="35" cy="34" r="3.2" fill="url(#automation-gradient)" />
    </svg>
  );
}

export default Login;
