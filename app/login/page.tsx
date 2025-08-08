"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useUserStore } from '@/lib/store/userStore'
import User from "@/models/User";
import { MessageCircle, Eye, EyeOff, Mail, Lock} from "lucide-react"; // Add this if you're using lucide-react



function LoginPage() {
  const { setUser } = useUserStore();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.log(result.error);
    } else {
      const findUser = await fetch("/api/findUser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      }).then(res => res.json()).catch(err => {
        console.error("Error fetching user:", err);
        return null;
      });
      console.log("findUser:", findUser);
      setUser(findUser)
      router.push("/");
    }
  };

 return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 relative overflow-hidden">
      <form onSubmit={handleSubmit} >
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
          boxShadow: '15px 15px 30px rgba(217, 119, 6, 0.15), -15px -15px 30px rgba(255, 255, 255, 0.9)'
        }}
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
               style={{
                 boxShadow: 'inset 6px 6px 12px rgba(217, 119, 6, 0.1), inset -6px -6px 12px rgba(255, 255, 255, 0.9)'
               }}>
            <MessageCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-sm">Sign in to your MeetIN account</p>
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
        <div className="mb-6">
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
              />
              <label 
                htmlFor="checkbox"
                className="flex items-center cursor-pointer"
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
          <a className="text-amber-600 hover:text-amber-700 underline text-sm transition-colors duration-200" href="#">
            Forgot Password?
          </a>
        </div>

        {/* Login Button */}
        <button 
          type="submit" 
          className="w-full mb-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-amber-200"
          style={{
            boxShadow: '6px 6px 12px rgba(217, 119, 6, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.9)'
          }}
        >
          Log In
        </button>

        {/* Signup link */}
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <button 
            onClick={() => {/* router.push("/signup") */}} 
            className="text-amber-600 font-semibold hover:text-amber-700 underline transition-colors duration-200"
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