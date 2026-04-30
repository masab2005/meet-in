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
                <div className="neumorph-card max-w-[420px] w-full mx-4 p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Invalid Link</h2>
                        <p className="text-gray-500 text-sm">This password reset link is invalid or has expired.</p>
                    </div>
                    <button
                        onClick={() => router.push("/forget-password")}
                        className="neumorph-button w-full"
                    >
                        Request New Link
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

            <div className="relative z-10 neumorph-card max-w-[420px] w-full mx-4 p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-500">
                {!success ? (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Logo and Title */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <MessageCircle className="w-8 h-8 text-amber-700" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">New Password</h2>
                            <p className="text-gray-500 text-sm mt-1 px-4">Set a strong password for your account</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-in shake duration-300">
                                <div className="flex items-start">
                                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-red-800 font-bold text-sm">Error</h4>
                                        <p className="text-red-700 text-xs mt-1">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* New Password Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                <div className={`neumorph-input-container ${error ? 'ring-2 ring-red-200 border-red-300' : ''}`}>
                                    <Lock className="w-5 h-5 text-gray-400 mr-3" />
                                    <input
                                        className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 py-1"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
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
                                        className="text-gray-400 hover:text-gray-600 p-1"
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className={`neumorph-input-container ${error ? 'ring-2 ring-red-200 border-red-300' : ''}`}>
                                    <Lock className="w-5 h-5 text-gray-400 mr-3" />
                                    <input
                                        className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 py-1"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
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
                                        className="text-gray-400 hover:text-gray-600 p-1"
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <button 
                            type="submit" 
                            disabled={loading || !password || !confirmPassword}
                            className={`neumorph-button w-full ${loading || !password || !confirmPassword ? 'opacity-70 cursor-not-allowed grayscale-[0.2]' : ''}`}
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Resetting...</span>
                                </div>
                            ) : (
                                'Reset password'
                            )}
                        </button>
                    </form>
                ) : (
                    /* Success Message */
                    <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">All Set!</h2>
                            <p className="text-gray-500 text-sm">
                                Your password has been successfully updated.
                            </p>
                        </div>
                        
                        <button
                            onClick={() => router.push("/login")}
                            className="neumorph-button w-full"
                        >
                            Return to Login
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
                    <div className="neumorph-card max-w-[420px] w-full mx-4 p-8 text-center">
                        <div className="flex items-center justify-center space-x-3">
                            <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                            <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Loading Security Layer...</span>
                        </div>
                    </div>
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    )
}