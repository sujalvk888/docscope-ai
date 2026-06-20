'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EBE3C3] p-4">
      <Card className="w-full max-w-[400px] border-none shadow-2xl shadow-[#1A1515]/10 bg-[#DFD6B7]">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-[#1A1515] text-center">Login to DocScope</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[#2B1C18] font-semibold">Email</Label>
              <Input type="email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-3">
              <Label className="text-[#2B1C18] font-semibold">Password</Label>
              <Input type="password" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button className="w-full text-base py-6 rounded-xl mt-4" type="submit">Sign In</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}