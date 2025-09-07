"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        router.push("/login");
      }, 2000);
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-blue-900 via-blue-600 to-blue-200 animate-gradient-x p-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md p-8 bg-white/95 rounded-xl shadow-lg relative"
      >
        <img
    src="/TT+.png"
    alt="Logo"
    className="w-20 mb-4 block"
  />

  <div className="mb-6">
    <h2 className="text-left text-blue-900 text-2xl font-semibold">
      SIGNUP
    </h2>
    <p className="text-left text-gray-600 text-sm mt-1">
      Enter your details to register
    </p>
  </div>

        <Input
          type="email"
          placeholder="Email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
          required
           className="text-white dark:text-white"
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            defaultValue={password}
            onChange={(e) => setPassword(e.target.value)}
            required
             className="text-white dark:text-white"
             
          />
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer z-10"
            onClick={() => setShowPassword(!showPassword)}
          >
            <img
              src={showPassword ? "/icons/EyeIcon.svg" : "/icons/EyeCloseIcon.svg"}
              alt="Toggle Password"
              className="w-5 h-5"
            />
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Register
        </button>

        <p className="text-center text-gray-700 text-sm mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-900 font-semibold hover:text-blue-800"
          >
            Sign in
          </Link>
        </p>
      </form>

      {showPopup && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          ✅ Account created!
        </div>
      )}

      <style jsx>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 10s ease infinite;
        }
      `}</style>
    </div>
  );
}
