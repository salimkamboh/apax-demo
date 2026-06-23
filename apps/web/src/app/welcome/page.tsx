"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  authTokenStorageKey,
  authUserStorageKey,
  clearAuthSession,
  type LoginResponse,
} from "@/lib/auth";

type AuthUser = LoginResponse["user"];

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      await Promise.resolve();

      const token = localStorage.getItem(authTokenStorageKey);
      const savedUser = localStorage.getItem(authUserStorageKey);

      if (!token || !savedUser) {
        router.replace("/login");
        return;
      }

      try {
        setUser(JSON.parse(savedUser) as AuthUser);
      } catch {
        clearAuthSession();
        router.replace("/login");
        return;
      }

      setIsCheckingSession(false);
    };

    void checkSession();
  }, [router]);

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/login");
  };

  if (isCheckingSession) {
    return (
      <main className="page-shell">
        <section className="card">
          <p className="eyebrow">Checking session</p>
          <h1>Loading...</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">Authenticated</p>
        <h1>Welcome {user?.name}</h1>
        <p>You are signed in successfully.</p>

        <div className="action-row">
          <button className="logout-link" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}
