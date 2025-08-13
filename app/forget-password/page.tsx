'use client'
import { useState } from "react"

export default function ForgetPasswordPage(){
    const [email,setEmail] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await fetch(`/api/sendResetPasswordEmail?email=${encodeURIComponent(email)}`, {
            method: "POST"
        })
        if(!res.ok){
            const data = await res.json()
            console.error(data.error || "Failed to send reset email")
            return
        }
        const data = await res.json()
        console.log(data.message || "Reset email sent")
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email"
            />
            <button type="submit">Reset Password</button>
        </form>
    )
}
