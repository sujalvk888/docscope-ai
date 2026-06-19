'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintButton() {
  return (
    // The "print:hidden" class ensures this button disappears from the final PDF!
    <Button 
      onClick={() => window.print()} 
      className="bg-blue-600 hover:bg-blue-500 text-white print:hidden shadow-md"
    >
      <Printer className="mr-2 h-4 w-4" /> Save as PDF
    </Button>
  )
}