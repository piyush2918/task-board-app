"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        toast.error(data.error ?? "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 text-gray-900">
      <div className="flex w-full max-w-md flex-col items-center">
        <h1 className="mb-6 text-center text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          Taskify
        </h1>

        <div className="w-full rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Login
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white p-3 rounded-lg"
          >
            Login
          </button>

           <p className="mt-4 text-center text-sm text-gray-600">
            Do no`t have an account?{" "}
          <Link href="/signup" className="font-medium text-black underline">
            Signup
          </Link>
        </p>
        </div>
      </div>
      </div>
    </main>
  );
}
