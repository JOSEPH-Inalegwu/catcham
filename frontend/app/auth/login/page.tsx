"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const { signInWithOAuth } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 bg-[#101010]">
      <div className="relative z-10 w-full max-w-[360px]">
        <div className="mb-10 text-center flex flex-col items-center">
          <Link href="/" className="inline-block">
            <img src="/logo (2).png" alt="CatchAm Logo" className="h-16 w-auto" />
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-[#ffffff]">
            Log in to CatchAm
          </h1>
        </div>

        <div className="space-y-3">
          <button onClick={() => signInWithOAuth("google")} className="flex w-full items-center justify-center gap-3 rounded-[6px] border border-[#3d3a39] bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-[#ffffff] transition-colors hover:bg-[#2a2a2a] hover:border-[#5a5a5a]">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </button>

          <button onClick={() => signInWithOAuth("azure")} className="flex w-full items-center justify-center gap-3 rounded-[6px] border border-[#3d3a39] bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-[#ffffff] transition-colors hover:bg-[#2a2a2a] hover:border-[#5a5a5a]">
            <svg viewBox="0 0 23 23" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path fill="#f3f3f3" d="M0 0h23v23H0z" />
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            Continue with Microsoft
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-[#3d3a39]"></div>
            <span className="flex-shrink-0 px-4 text-xs text-[#a0a0a0]">Enterprise</span>
            <div className="flex-grow border-t border-[#3d3a39]"></div>
          </div>

          <button onClick={() => signInWithOAuth("saml")} className="flex w-full items-center justify-center gap-3 rounded-[6px] border border-[#3d3a39] bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-[#ffffff] transition-colors hover:bg-[#2a2a2a] hover:border-[#5a5a5a]">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a0a0a0]">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
            </svg>
            Continue with SAML SSO
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-[#a0a0a0]">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-[#ffffff] hover:underline">Sign up</Link>
          {" "}or{" "}
          <Link href="/" className="text-[#ffffff] hover:underline">Learn more</Link>
        </div>
      </div>
    </div>
  );
}
