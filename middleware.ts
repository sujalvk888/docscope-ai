import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Pass the request to our Supabase helper to check the user's ID
  return await updateSession(request)
}

// This config tells Next.js to run the bouncer on every page EXCEPT images, icons, and background code
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}