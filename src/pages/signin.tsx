'use client'
import { signIn } from "next-auth/react"
import { GoogleLoginButton } from "react-social-login-buttons";

export default function Signin() {
  return (
    <div className="min-h-screen max-sm:px-4 flex items-center justify-center bg-primary-gradient">
      <div className=" bg-black bg-opacity-70 border-gray-400 border w-full max-w-md p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-semibold text-white mb-6">Welcome to ThoughtBook</h1>
        <p className="text-lg text-primaryText mb-8">Create spaces, add notes, links, watch videos with friends, and add collaborators.</p>
        <div className="flex flex-col items-center gap-4">
          <GoogleLoginButton onClick={() => signIn("google", { callbackUrl: sessionStorage.getItem("url") || '/home' })} />
        </div>
      </div>
    </div>
  )
}
