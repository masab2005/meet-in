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

        <div className="relative z-10 neumorph-card max-w-[420px] w-full mx-auto p-8 sm:p-10 space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MessageCircle className="w-8 h-8 text-amber-700" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Sign up for your MeetIN account</p>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-green-800 font-bold text-sm">Success!</h4>
                    <p className="text-green-700 text-xs mt-1">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-in shake duration-300">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-800 font-bold text-sm">Action Required</h4>
                    <p className="text-red-700 text-xs mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2">
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className={`neumorph-input-container !p-2.5 ${fieldErrors.name ? 'ring-2 ring-red-200 border-red-300' : ''}`}>
                <User className="w-4 h-4 text-gray-400 mx-2" />
                <input
                  className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldError('name');
                  }}
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1 text-red-600 text-[10px] font-medium flex items-center ml-1">
                  <AlertCircle className="w-2.5 h-2.5 mr-1" />
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className={`neumorph-input-container !p-2.5 ${fieldErrors.email ? 'ring-2 ring-red-200 border-red-300' : ''}`}>
                <Mail className="w-4 h-4 text-gray-400 mx-2" />
                <input
                  className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  placeholder="name@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-red-600 text-[10px] font-medium flex items-center ml-1">
                  <AlertCircle className="w-2.5 h-2.5 mr-1" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Passwords Divider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className={`neumorph-input-container !p-2.5 ${fieldErrors.password ? 'ring-2 ring-red-200 border-red-300' : ''}`}>
                  <Lock className="w-4 h-4 text-gray-400 mx-2" />
                  <input
                    className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError('password');
                      if (confirmPassword && e.target.value === confirmPassword) {
                        clearFieldError('confirmPassword');
                      }
                    }}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-red-600 text-[10px] font-medium flex items-center ml-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className={`neumorph-input-container !p-2.5 ${fieldErrors.confirmPassword ? 'ring-2 ring-red-200 border-red-300' : ''}`}>
                  <Lock className="w-4 h-4 text-gray-400 mx-2" />
                  <input
                    className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError('confirmPassword');
                    }}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-red-600 text-[10px] font-medium flex items-center ml-1">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-6">
            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`neumorph-button w-full ${isLoading ? 'opacity-70 cursor-not-allowed grayscale-[0.2]' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Preparing Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login link */}
            <p className="text-center text-gray-500 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { router.push("/login") }}
                disabled={isLoading}
                className="text-amber-600 font-bold hover:text-amber-700 transition-colors underline decoration-2 underline-offset-4"
              >
                Log In
              </button>
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}

export default RegisterPage;