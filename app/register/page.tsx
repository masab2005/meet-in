"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MessageCircle, Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, CheckCircle } from "lucide-react";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const router = useRouter();

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
    let isValid = true;

    // Name validation
    if (!name.trim()) {
      errors.name = "Full name is required";
      isValid = false;
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset previous states
    setError("");
    setSuccess("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        switch (res.status) {
          case 400:
            if (data.error?.includes("email")) {
              setError("This email is already registered. Please use a different email or try logging in.");
            } else if (data.error?.includes("name")) {
              setError("This username is already taken. Please choose a different name.");
            } else {
              setError(data.error || "Invalid registration data. Please check your information.");
            }
            break;
          case 409:
            setError("An account with this email already exists. Please try logging in instead.");
            break;
          case 422:
            setError("Invalid data format. Please check your information and try again.");
            break;
          case 500:
            setError("Server error occurred. Please try again later.");
            break;
          default:
            setError(data.error || "Registration failed. Please try again.");
        }
        return;
      }

      console.log("Registration successful:", data);
      setSuccess("Account created successfully! Redirecting to login...");
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setError("Network error. Please check your internet connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearFieldError = (field: string) => {
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
    if (error) setError("");
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
                boxShadow: 'inset 6px 6px 12px rgba(165, 119, 6, 0.15), inset -6px -6px 12px rgba(165, 119, 6, 0.15)'
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

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl transition-all duration-300">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-green-800 font-medium text-sm mb-1">Success!</h4>
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* General Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl transition-all duration-300">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-red-800 font-medium text-sm mb-1">Registration Failed</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Name Input */}
          <div className="mb-4">
            <div className={`flex items-center bg-gray-50 border rounded-xl p-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-200 ${
              fieldErrors.name ? 'border-red-300 hover:border-red-400 focus-within:border-red-400' : 'border-gray-200 hover:border-amber-300 focus-within:border-amber-400'
            }`}
                 style={{
                   boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                 }}>
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <input
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 py-1"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearFieldError('name');
                }}
                placeholder="Full Name"
                required
                disabled={isLoading}
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1 text-red-600 text-xs flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <div className={`flex items-center bg-gray-50 border rounded-xl p-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-200 ${
              fieldErrors.email ? 'border-red-300 hover:border-red-400 focus-within:border-red-400' : 'border-gray-200 hover:border-amber-300 focus-within:border-amber-400'
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
                  clearFieldError('email');
                }}
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-red-600 text-xs flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <div className={`flex items-center bg-gray-50 border rounded-xl p-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-200 ${
              fieldErrors.password ? 'border-red-300 hover:border-red-400 focus-within:border-red-400' : 'border-gray-200 hover:border-amber-300 focus-within:border-amber-400'
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
                  clearFieldError('password');
                  // Also clear confirm password error if passwords now match
                  if (confirmPassword && e.target.value === confirmPassword) {
                    clearFieldError('confirmPassword');
                  }
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
            {fieldErrors.password && (
              <p className="mt-1 text-red-600 text-xs flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <div className={`flex items-center bg-gray-50 border rounded-xl p-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-200 ${
              fieldErrors.confirmPassword ? 'border-red-300 hover:border-red-400 focus-within:border-red-400' : 'border-gray-200 hover:border-amber-300 focus-within:border-amber-400'
            }`}
                 style={{
                   boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                 }}>
              <Lock className="w-5 h-5 text-gray-400 mr-3" />
              <input
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 py-1"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError('confirmPassword');
                }}
                placeholder="Confirm Password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-red-600 text-xs flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full mb-4 font-semibold py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-200 flex items-center justify-center ${
              isLoading 
                ? 'bg-amber-400 cursor-not-allowed' 
                : 'bg-amber-500 hover:bg-amber-600 hover:scale-[1.02] cursor-pointer'
            } text-white`}
            style={{
              boxShadow: '6px 6px 12px rgba(217, 119, 6, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login link */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => { router.push("/login") }}
              disabled={isLoading}
              className={`text-amber-600 font-semibold cursor-pointer hover:text-amber-700 underline transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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