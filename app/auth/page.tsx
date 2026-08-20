"use client";

import {
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { supabase } from "@/lib/supabase";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (mode === "signup" && !cleanName) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (loginError) {
        console.error(loginError);

        setError(
          loginError.message === "Invalid login credentials"
            ? "Incorrect email or password."
            : loginError.message
        );

        setLoading(false);
        return;
      }

      window.location.href = "/account";
      return;
    }

    const { data, error: signupError } =
      await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
          },
        },
      });

    if (signupError) {
      console.error(signupError);

      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      window.location.href = "/account";
      return;
    }

    setMessage(
      "Account created! Check your email to confirm your account."
    );

    setLoading(false);
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-950">
      {/* HEADER */}

      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white">
              <ShieldCheck size={18} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              FixNear
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            Back to home
          </Link>
        </div>
      </header>

      {/* AUTH */}

      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* INTRO */}

          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <ShieldCheck size={25} />
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight">
              {mode === "login"
                ? "Welcome back"
                : "Join FixNear"}
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500">
              {mode === "login"
                ? "Sign in to manage your FixNear activity."
                : "Create an account to connect with trusted local professionals."}
            </p>
          </div>

          {/* CARD */}

          <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.2)] sm:p-8">
            {/* MODE SWITCH */}

            <div className="grid grid-cols-2 rounded-xl bg-zinc-100 p-1">
              <button
                type="button"
                onClick={() =>
                  switchMode("login")
                }
                className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-500"
                }`}
              >
                Log in
              </button>

              <button
                type="button"
                onClick={() =>
                  switchMode("signup")
                }
                className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-500"
                }`}
              >
                Sign up
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              {/* NAME */}

              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                  />
                </div>
              )}

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="At least 6 characters"
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                />
              </div>

              {/* ERROR */}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                  {error}
                </div>
              )}

              {/* MESSAGE */}

              {message && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700">
                  {message}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    {mode === "login"
                      ? "Signing in..."
                      : "Creating account..."}
                  </>
                ) : (
                  <>
                    {mode === "login"
                      ? "Log in"
                      : "Create account"}

                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* FOOTER */}

            <p className="mt-6 text-center text-xs leading-5 text-zinc-400">
              By continuing, you agree to use FixNear
              responsibly and provide accurate information.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}