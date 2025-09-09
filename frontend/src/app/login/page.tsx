"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Input from "@/components/form/input/InputField";

const popupStyle = {
  position: "fixed" as const,
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#4BB543",
  color: "white",
  padding: "1rem 2rem",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1.2rem",
  zIndex: 9999,
  boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { setToken } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.access_token);
      localStorage.setItem("access_token", data.access_token);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        router.push("/feedback-dashboard");
      }, 2000);
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-blue-900 via-blue-600 to-blue-200 animate-gradient-x p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 bg-white/95 rounded-xl shadow-lg relative"
      >
        {/* Logo */}
       <img
    src="/TT+.png"
    alt="Logo"
    className="w-20 mb-4 block"
  />

        {/* Title & Subtitle */}
        <div className="mb-6">
          <h2 className="text-left text-blue-900 text-2xl font-semibold">
            LOGIN
          </h2>
          <p className="text-left text-gray-600 text-sm mt-1">
            Enter your details to log in
          </p>
        </div>

        {/* Email Input */}
        <Input
          type="email"
          placeholder="Email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-black dark:text-white dark:border-white border-gray-300"
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            defaultValue={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-black dark:text-white dark:border-white border-gray-300"
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

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-3 mt-4 text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Login houssam
        </button>

        {/* Register Link */}
        <p className="text-center text-gray-700 text-sm mt-4">
          Don t have an account?{" "}
          <a
            href="/register"
            className="text-blue-900 font-semibold hover:text-blue-800"
          >
            Sign up
          </a>
        </p>
      </form>

      {/* Success Popup */}
      {showPopup && (
        <div style={popupStyle}>
          ✅ You logged in successfully!
        </div>
      )}

      {/* Gradient Animation */}
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
