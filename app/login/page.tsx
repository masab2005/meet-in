"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useUserStore } from '@/lib/store/userStore'
import User from "@/models/User";
import { MessageCircle, Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

function LoginPage() {
  const { setUser } = useUserStore();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
        console.log(result.error);
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
          console.log("findUser:", userData);
          
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

        <div 
          className="relative z-10 bg-white text-gray-700 max-w-[400px] w-full mx-4 p-8 text-left text-sm rounded-2xl transition-all duration-300 hover:scale-[1.01]"
          style={{
                boxShadow: 'inset 6px 6px 12px rgba(165, 119, 6, 0.15), inset -6px -6px 12px rgba(165, 119, 6, 0.15)'
              }}
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-amber-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm">Sign in to your MeetIN account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl transition-all duration-300">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-red-800 font-medium text-sm mb-1">Login Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4">
            <div className={`flex items-center bg-gray-50 border rounded-xl p-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-200 ${
              error ? 'border-red-300 hover:border-red-400 focus-within:border-red-400' : 'border-gray-200 hover:border-amber-300 focus-within:border-amber-400'
            }`}
                 style={{
                   boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                 }}>
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <input
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 py-1"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(""); // Clear error when user starts typing
                }}
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <div className={`flex items-center bg-gray-50 border rounded-xl p-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-200 ${
              error ? 'border-red-300 hover:border-red-400 focus-within:border-red-400' : 'border-gray-200 hover:border-amber-300 focus-within:border-amber-400'
            }`}
                 style={{
                   boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                 }}>
              <Lock className="w-5 h-5 text-gray-400 mr-3" />
              <input
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 py-1"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(""); // Clear error when user starts typing
                }}
                placeholder="Password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <input 
                  id="checkbox" 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <label 
                  htmlFor="checkbox"
                  className={`flex items-center ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  <div className={`w-5 h-5 rounded-lg mr-3 flex items-center justify-center transition-all duration-200 ${
                    rememberMe 
                      ? 'bg-amber-100 border border-amber-300' 
                      : 'bg-gray-100 border border-gray-300'
                  }`}
                       style={{
                         boxShadow: rememberMe 
                           ? 'inset 2px 2px 4px rgba(217, 119, 6, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
                           : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
                       }}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-600 text-sm">Remember me</span>
                </label>
              </div>
            </div>
            <a onClick={() => router.push("/forget-password")} className={`text-amber-700 hover:text-amber-800 underline text-sm transition-colors duration-200 ${
              isLoading ? 'pointer-events-none opacity-50' : ''
            }`} >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full mb-4 cursor-pointer font-semibold py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-200 flex items-center justify-center ${
              isLoading 
                ? 'bg-amber-400 cursor-not-allowed' 
                : 'bg-amber-500 hover:bg-amber-600 hover:scale-[1.02]'
            } text-white`}
            style={{
              boxShadow: '6px 6px 12px rgba(217, 119, 6, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              'Log In'
            )}
          </button>

          {/* Signup link */}
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => { router.push("/register") }} 
              disabled={isLoading}
              className={`text-amber-600 font-semibold cursor-pointer hover:text-amber-700 underline transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;