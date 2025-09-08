'use client'
import { useState } from "react"
import { useRouter } from "next/navigation";
import { MessageCircle, Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgetPasswordPage(){
    const [email, setEmail] = useState<string>("")
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch(`/api/sendResetPasswordEmail?email=${encodeURIComponent(email)}`, {
                method: "POST"
            })
            
            if(!res.ok){
                const data = await res.json()
                console.error(data.error || "Failed to send reset email")
                // Map common errors to user-friendly messages
                switch (res.status) {
                    case 404:
                        setError("No account found with this email address.");
                        break;
                    case 429:
                        setError("Too many requests. Please wait a few minutes before trying again.");
                        break;
                    case 500:
                        setError("Server error. Please try again later.");
                        break;
                    default:
                        setError(data.error || "Failed to send reset email. Please try again.");
                }
                return
            }
            
            const data = await res.json()
            console.log(data.message || "Reset email sent")
            setSuccess(true);
        } catch (error) {
            console.error("Reset password error:", error);
            setError("An unexpected error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
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
                {/* Back button */}
                <button
                    onClick={() => router.push("/login")}
                    disabled={isLoading}
                    className={`mb-4 flex items-center text-amber-600 hover:text-amber-700 transition-colors duration-200 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </button>

                {!success ? (
                    <form onSubmit={handleSubmit}>
                        {/* Logo and Title */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-8 h-8 text-amber-700" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
                            <p className="text-gray-600 text-sm">Enter your email and we will send you a reset link</p>
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

                        {/* Email Input */}
                        <div className="mb-6">
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
                                    placeholder="Enter your email"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Reset Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading || !email}
                            className={`w-full mb-4 cursor-pointer font-semibold py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-200 flex items-center justify-center ${
                                isLoading || !email
                                    ? 'bg-amber-600 cursor-not-allowed opacity-70' 
                                    : 'bg-amber-500 hover:bg-amber-600 hover:scale-[1.02]'
                            } text-white`}
                            style={{
                                boxShadow: '6px 6px 12px rgba(217, 119, 6, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Sending Reset Link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                ) : (
                    /* Success Message */
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
                        <p className="text-gray-600 text-sm mb-6">
                            We have sent a password reset link to <strong>{email}</strong>
                        </p>
                        <p className="text-gray-500 text-xs mb-6">
                            Did not receive the email? Check your spam folder or try again in a few minutes.
                        </p>
                        
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail("");
                                }}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                Try Another Email
                            </button>
                            
                            <button
                                className="w-full cursor-pointer bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                                onClick={() => router.push("/login")}
                                style={{
                                    boxShadow: '6px 6px 12px rgba(217, 119, 6, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                                }}
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}