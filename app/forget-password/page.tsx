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
            
            await res.json()
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

            <div className="relative z-10 neumorph-card max-w-[420px] w-full mx-4 p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-500">
                {/* Back button */}
                <button
                    onClick={() => router.push("/login")}
                    disabled={isLoading}
                    className="group mb-8 flex items-center text-amber-600 hover:text-amber-700 font-bold text-xs uppercase tracking-widest transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </button>

                {!success ? (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Logo and Title */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <MessageCircle className="w-8 h-8 text-amber-700" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Email Recovery</h2>
                            <p className="text-gray-500 text-sm mt-1 px-4">Enter your email and we&apos;ll send a reset link</p>
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

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Email</label>
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

                        {/* Reset Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading || !email}
                            className={`neumorph-button w-full ${isLoading || !email ? 'opacity-70 cursor-not-allowed grayscale-[0.2]' : ''}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Sending Link...</span>
                                </div>
                            ) : (
                                'Send reset link'
                            )}
                        </button>
                    </form>
                ) : (
                    /* Success Message */
                    <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Check Inbox</h2>
                            <p className="text-gray-500 text-sm">
                                Link sent to <br/><span className="text-gray-900 font-bold">{email}</span>
                            </p>
                        </div>
                        
                        <div className="pt-4 space-y-4">
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail("");
                                }}
                                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-3 rounded-xl transition-all border border-gray-100"
                            >
                                Use different email
                            </button>
                            
                            <button
                                className="neumorph-button w-full"
                                onClick={() => router.push("/login")}
                            >
                                Return to Login
                            </button>
                        </div>

                        <p className="text-[10px] text-gray-400 px-6 italic">
                            Didn&apos;t get the email? Check spam or wait a few minutes.
                        </p>
                    </div>
                )}
            </div>

        </div>
    )
}