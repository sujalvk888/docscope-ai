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

    // Ensure it's a PDF or TXT file
    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      alert('Please upload a PDF or TXT file.')
      return
    }

    setIsUploading(true)

    try {
      // 1. Create a unique, safe file path (e.g., user-id/123456789-myfile.pdf)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      // 2. Upload the file to the Supabase Storage 'documents' bucket
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      // 4. Save the file details to our PostgreSQL database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_url: publicUrl
        })

      if (dbError) throw dbError

      // 5. Success! Refresh the page to show the new document
      router.refresh()
    } catch (error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : 'An unknown error occurred'

  alert(`Upload failed: ${message}`)
} finally {
      setIsUploading(false)
      // Reset the hidden file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <>
      <input
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        className="bg-blue-600 hover:bg-blue-500 text-white w-fit shadow-sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        {isUploading ? 'Uploading...' : "Let's Start (Upload File)"}
      </Button>
    </>
  )
}