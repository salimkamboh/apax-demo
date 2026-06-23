"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { login, saveAuthSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@apax.local");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loginResult = await login(email, password);
      saveAuthSession(loginResult);
      router.push("/welcome");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="card login-card">
        <p className="eyebrow">Secure sign in</p>
        <h1>Login to APAX</h1>
        <p>
          Use the seeded demo user or change the credentials to test validation
          errors from the API.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              autoComplete="email"
              disabled={isLoading}
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              disabled={isLoading}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <button disabled={isLoading} type="submit">
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error ? (
          <div className="alert error" role="alert">
            {error}
          </div>
        ) : null}
      </section>
    </main>
  );
}
