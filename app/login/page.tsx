"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useUserStore } from '@/lib/store/userStore'
import Link from "next/link";
import { MessageCircle, Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

function LoginPage() {
  const { setUser } = useUserStore();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Map common authentication errors to user-friendly messages
        switch (result.error) {
          case "CredentialsSignin":
            setError("Invalid email or password. Please check your credentials and try again.");
            break;
          case "Configuration":
            setError("Authentication service is temporarily unavailable. Please try again later.");
            break;
          default:
            setError("Login failed. Please check your credentials and try again.");
        }
      } else {
        try {
          const findUser = await fetch("/api/findUser", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
          });

          if (!findUser.ok) {
            throw new Error(`Failed to fetch user data: ${findUser.status}`);
          }

          const userData = await findUser.json();

          if (userData) {
            setUser(userData);
          }
          router.push("/home");
        } catch (fetchError) {
          console.error("Error fetching user:", fetchError);
          setError("Login successful, but failed to load user data. Please refresh the page.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-200 via-amber-200 to-amber-300 relative overflow-hidden">
      <form onSubmit={handleSubmit}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full opacity-20"
            style={{
              animation: 'float 6s ease-in-out infinite',
              animationDelay: '0s'
            }}></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-amber-300 rounded-full opacity-30"
            style={{
              animation: 'slowFloat 8s ease-in-out infinite',
              animationDelay: '2s'
            }}></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-amber-400 rounded-full opacity-25"
            style={{
              animation: 'float 6s ease-in-out infinite',
              animationDelay: '4s'
            }}></div>
        </div>

        {/* Animation keyframes */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes slowFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-10px) scale(1.05); }
          }
        `}</style>

        <div className="relative z-10 neumorph-card max-w-[420px] w-full mx-auto p-8 sm:p-12 space-y-8 animate-in fade-in zoom-in-95 duration-500">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <MessageCircle className="w-10 h-10 text-amber-700" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-2">Sign in to your MeetIN account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-in shake duration-300">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-red-800 font-bold text-sm">Login Error</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className={`neumorph-input-container ${error ? 'ring-2 ring-red-200 border-red-300' : ''}`}>
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 py-1"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="name@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                <Link href="/forget-password" title="Recover password" className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors uppercase tracking-tight">
                  Forgot?
                </Link>
              </div>
              <div className={`neumorph-input-container ${error ? 'ring-2 ring-red-200 border-red-300' : ''}`}>
                <Lock className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 py-1"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-6">
            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`neumorph-button w-full ${isLoading ? 'opacity-70 cursor-not-allowed grayscale-[0.2]' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Signup link */}
            <p className="text-center text-gray-500 text-sm">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => { router.push("/register") }}
                disabled={isLoading}
                className="text-amber-600 font-bold hover:text-amber-700 transition-colors underline decoration-2 underline-offset-4"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}

export default LoginPage;