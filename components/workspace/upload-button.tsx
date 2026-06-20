'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'

export function UploadButton({ userId }: { userId: string }) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      alert('Please upload a PDF or TXT file.')
      return
    }

    setIsUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath)

      const { error: dbError } = await supabase.from('documents').insert({
          user_id: userId,
          file_name: file.name,
          file_url: publicUrl
        })

      if (dbError) throw dbError
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      alert(`Upload failed: ${message}`)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <input type="file" accept=".pdf,.txt" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <Button
        className="bg-[#E9C85B] hover:bg-[#D4B54B] text-[#1A1515] font-bold text-base px-8 py-6 rounded-2xl shadow-lg w-fit"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Plus className="mr-2 h-5 w-5" />
        )}
        {isUploading ? 'Uploading...' : "Upload New File"}
      </Button>
    </>
  )
}