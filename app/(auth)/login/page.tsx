'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import logo from '@/app/Images/logo.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      alert(error.message)
      setIsLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen w-full font-sans bg-[#EBE3C3]">
      
      {/* LEFT PANEL: Branding & Aesthetics (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-center bg-[#1A1515] p-12 text-[#F5F2E8] lg:flex overflow-hidden z-0">
        
        {/* Ambient Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-[#91361D] rounded-full blur-[150px] opacity-40 mix-blend-screen pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-[#5F170D] rounded-full blur-[150px] opacity-40 mix-blend-screen pointer-events-none -z-10" />

        {/* Logo (Fixed to top left) */}
        <div className="absolute top-12 left-12 flex items-center space-x-3 z-10">
          <Image 
            src={logo} 
            alt="DocScope AI Logo" 
            width={32} 
            height={32} 
            className="rounded-md object-contain"
          />
          <span className="font-extrabold text-2xl tracking-tight">DocScope AI</span>
        </div>

        {/* Center Decorative Value Prop */}
        <div className="z-10 flex flex-col items-start space-y-6 max-w-lg">
          <div className="inline-flex items-center space-x-2 bg-[#F5F2E8]/10 border border-[#F5F2E8]/20 backdrop-blur-md rounded-full px-5 py-2 shadow-lg">
            <Sparkles className="h-4 w-4 text-[#E9C85B]" />
            <span className="text-sm font-medium text-[#F5F2E8]/90 tracking-wide">
              Premium Document Intelligence
            </span>
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight">
            Unlock the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E9C85B] to-[#DB6E4C]">hidden value</span> in your documents.
          </h1>
          <p className="text-[#F5F2E8]/70 text-lg font-light leading-relaxed">
            Experience the next generation of interactive learning. Chat, highlight, and test your knowledge in one beautiful workspace.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Auth Form */}
      <div className="relative flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12">
        
        {/* Back Navigation (Absolute positioned) */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 sm:top-8 sm:left-8 inline-flex items-center text-[#73615A] hover:text-[#DB6E4C] transition-colors text-sm font-bold tracking-wide z-10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Home
        </Link>

        {/* Mobile Logo (Visible only on small screens) */}
        <div className="flex lg:hidden items-center space-x-3 mb-8 sm:mb-10 mt-8 sm:mt-0">
          <Image 
            src={logo} 
            alt="DocScope AI Logo" 
            width={28} 
            height={28} 
            className="rounded-md object-contain sm:w-[32px] sm:h-[32px]"
          />
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#1A1515]">DocScope AI</span>
        </div>

        {/* Form Container with Entrance Animation */}
        <div className="w-full max-w-[400px] animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-8 duration-700 ease-out">
          <div className="space-y-2 mb-8 sm:mb-10 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1515] tracking-tight">Welcome back</h2>
            <p className="text-[#73615A] text-sm sm:text-base font-medium">Enter your credentials to access your workspace.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-[#2B1C18] font-bold text-xs sm:text-sm uppercase tracking-wider">Email Address</Label>
              <Input 
                type="email" 
                placeholder="you@example.com" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={isLoading}
                className="bg-[#DFD6B7] border-[#D3C9AA] py-5 sm:py-6 text-sm sm:text-base rounded-xl font-medium placeholder:font-normal focus-visible:ring-[#DB6E4C]" 
              />
            </div>
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-[#2B1C18] font-bold text-xs sm:text-sm uppercase tracking-wider">Password</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={isLoading}
                className="bg-[#DFD6B7] border-[#D3C9AA] py-5 sm:py-6 text-sm sm:text-base rounded-xl font-medium placeholder:font-normal focus-visible:ring-[#DB6E4C]" 
              />
            </div>
            
            <Button 
              className="w-full text-base sm:text-lg py-6 sm:py-7 rounded-xl mt-2 sm:mt-4 bg-[#1A1515] hover:bg-[#2B2323] text-[#F5F2E8] shadow-xl shadow-[#1A1515]/10 font-bold transition-transform active:scale-[0.98]" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 animate-spin text-[#E9C85B]" /> : null}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 sm:mt-10 text-center border-t border-[#D3C9AA]/60 pt-6 sm:pt-8">
            <p className="text-[#73615A] text-sm sm:text-base font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#DB6E4C] hover:text-[#C25A3A] font-bold hover:underline underline-offset-4 transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}