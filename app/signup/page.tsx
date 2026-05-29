"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Signup successful. Please log in.");
        router.push("/login");
        return;
      }

      toast.error(data.error ?? "Signup failed");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 text-gray-900">
      <div className="flex w-full max-w-md flex-col items-center">
        <h1 className="mb-6 text-center text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          Taskify
        </h1>

        <div className="w-full rounded-xl bg-white p-8 shadow-md">
          <h1 className="mb-2 text-center text-2xl font-bold">Create account</h1>
          <p className="mb-6 text-center text-sm text-gray-600">
            Sign up to start managing your tasks.
          </p>

          <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-lg border p-3 text-gray-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border p-3 text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-3 text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignup}
            disabled={submitting}
            className="w-full rounded-lg bg-black p-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Signup"}
          </button>
        </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-black underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
