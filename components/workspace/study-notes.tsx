'use client'

import { useEffect, useState } from 'react'
import { Loader2, BookOpen } from 'lucide-react'

type Note = {
  id: string
  question: string
  ai_answer: string
  created_at: string
}

export function StudyNotes({ documentId }: { documentId: string }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchNotes = async () => {
      try {
        const res = await fetch(`/api/chat/history?documentId=${documentId}`)
        const data = await res.json()
        if (isMounted && data.notes) setNotes(data.notes)
      } catch (error) {
        console.error("Failed to fetch notes", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    fetchNotes()
    return () => { isMounted = false }
  }, [documentId])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-[#73615A] bg-[#EBE3C3] font-medium text-lg">
        <Loader2 className="h-6 w-6 animate-spin mr-3 text-[#DB6E4C]" /> Loading your guide...
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-[#73615A] bg-[#EBE3C3] p-10 text-center space-y-5">
        <div className="p-5 bg-[#DFD6B7] rounded-full shadow-sm border border-[#D3C9AA]">
          <BookOpen className="h-10 w-10 text-[#DB6E4C]" />
        </div>
        <p className="font-medium text-base max-w-[250px]">Your learning log is empty. Save important questions from your AI chat to build your study guide!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#EBE3C3]">
      <div className="h-14 border-b border-[#D3C9AA] bg-[#DFD6B7] flex items-center px-6 shrink-0 justify-between shadow-sm z-10">
        <span className="font-bold text-base text-[#1A1515] flex items-center">
          <BookOpen className="h-5 w-5 mr-3 text-[#DB6E4C]" /> My Study Guide
        </span>
        <span className="text-xs font-bold bg-[#E9C85B] text-[#1A1515] px-3 py-1.5 rounded-full shadow-sm">
          {notes.length} Saved
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-[#DFD6B7] p-6 rounded-3xl border border-[#D3C9AA] shadow-sm space-y-4 hover:border-[#DB6E4C]/50 transition-colors">
            <div className="font-bold text-[#1A1515] text-base border-b border-[#D3C9AA]/50 pb-4">
              <span className="text-[#DB6E4C] mr-2">Q:</span>{note.question}
            </div>
            <div className="text-[#2B1C18] text-base whitespace-pre-wrap leading-relaxed">
              {note.ai_answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}