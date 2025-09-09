'use client'
import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AlertCircle, Lock, Eye, EyeOff, MessageCircle, Loader2, CheckCircle } from "lucide-react"
export const dynamic = 'force-dynamic';


function ResetPasswordContent() {
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    const sp = useSearchParams();
    const router = useRouter();
    const token = sp.get("token");
    const email = sp.get("email");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/resetPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, token, password }),
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setSuccess("Password reset successful");
            } else {
                // Map common errors to user-friendly messages
                switch (res.status) {
                    case 400:
                        setError("Invalid or expired reset token. Please request a new password reset.");
                        break;
                    case 404:
                        setError("Reset token not found. Please request a new password reset.");
                        break;
                    case 429:
                        setError("Too many attempts. Please try again later.");
                        break;
                    case 500:
                        setError("Server error. Please try again later.");
                        break;
                    default:
                        setError(data.error || "Password reset failed. Please try again.");
                }
            }
        } catch (error) {
            console.error("Reset password error:", error);
            setError("An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Check if token and email are present
    if (!token || !email) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-200 via-amber-200 to-amber-300">
                <div className="bg-white text-gray-700 max-w-[400px] w-full mx-4 p-8 text-center rounded-2xl"
                     style={{
                         boxShadow: 'inset 6px 6px 12px rgba(165, 119, 6, 0.15), inset -6px -6px 12px rgba(165, 119, 6, 0.15)'
                     }}>
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid Reset Link</h2>
                    <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
                    <button
                        onClick={() => router.push("/forget-password")}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                    >
                        Request New Reset Link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-200 via-amber-200 to-amber-300 relative overflow-hidden">
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
                {!success ? (
                    <form onSubmit={handleSubmit}>
                        {/* Logo and Title */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-8 h-8 text-amber-700" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
                            <p className="text-gray-600 text-sm">Enter your new password below</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl transition-all duration-300">
                                <div className="flex items-start">
                                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-red-800 font-medium text-sm mb-1">Error</h4>
                                        <p className="text-red-700 text-sm">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* New Password Input */}
                        <div className="mb-4">
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
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError(null);
                                    }}
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
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
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (error) setError(null);
                                    }}
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="mb-6 text-xs text-gray-500">
                            <p>Password must be at least 6 characters long</p>
                        </div>

                        {/* Reset Button */}
                        <button 
                            type="submit" 
                            disabled={loading || !password || !confirmPassword}
                            className={`w-full mb-4 cursor-pointer font-semibold py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-200 flex items-center justify-center ${
                                loading || !password || !confirmPassword
                                    ? 'bg-amber-400 cursor-not-allowed opacity-70' 
                                    : 'bg-amber-500 hover:bg-amber-600 hover:scale-[1.02]'
                            } text-white`}
                            style={{
                                boxShadow: '6px 6px 12px rgba(217, 119, 6, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Resetting Password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>

                    </form>
                ) : (
                    /* Success Message */
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful</h2>
                        <p className="text-gray-600 text-sm mb-6">
                            Your password has been successfully reset. You can now login with your new password.
                        </p>
                        
                        <button
                            onClick={() => router.push("/login")}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                            style={{
                                boxShadow: '6px 6px 12px rgba(217, 119, 6, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                            }}
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-200 via-amber-200 to-amber-300">
                    <div className="bg-white text-gray-700 max-w-[400px] w-full mx-4 p-8 text-center rounded-2xl" style={{ boxShadow: 'inset 6px 6px 12px rgba(165, 119, 6, 0.15), inset -6px -6px 12px rgba(165, 119, 6, 0.15)' }}>
                        <div className="flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-amber-600 mr-2" />
                            <span>Loading...</span>
                        </div>
                    </div>
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    )
}