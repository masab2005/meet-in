"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MessageCircle, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("passwords do not match");
      return;
    }

    try {
      // react-query
      // loading, error, debounce
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      console.log(data);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-200 via-amber-200 to-amber-300 relative overflow-hidden">
      <form onSubmit={handleSumit}>
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
            boxShadow: '15px 15px 30px rgba(217, 119, 6, 0.12), -15px -15px 30px rgba(255, 119, 6, 0.09)'
          }}
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-amber-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600 text-sm">Sign up for your MeetIN account</p>
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-3 transition-all duration-300 hover:border-amber-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200"
                 style={{
                   boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                 }}>
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <input
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 py-1"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-3 transition-all duration-300 hover:border-amber-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200"
                 style={{
                   boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                 }}>
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <input
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 py-1"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-3 transition-all duration-300 hover:border-amber-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200"
                 style={{
                   boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                 }}>
              <Lock className="w-5 h-5 text-gray-400 mr-3" />
              <input
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 py-1"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-3 transition-all duration-300 hover:border-amber-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200"
                 style={{
                   boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                 }}>
              <Lock className="w-5 h-5 text-gray-400 mr-3" />
              <input
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 py-1"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button 
            type="submit" 
            className="w-full mb-4 cursor-pointer bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-amber-200"
            style={{
              boxShadow: '6px 6px 12px rgba(217, 119, 6, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            Create Account
          </button>

          {/* Login link */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => { router.push("/login") }} 
              className="text-amber-600 font-semibold cursor-pointer hover:text-amber-700 underline transition-colors duration-200"
            >
              Log In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;