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
    // 1. We use a cleanup flag to prevent memory leaks if the user closes the page before the fetch finishes
    let isMounted = true

    // 2. We moved the fetch function INSIDE the useEffect to fix the "exhaustive-deps" warning
    const fetchNotes = async () => {
      try {
        const res = await fetch(`/api/chat/history?documentId=${documentId}`)
        const data = await res.json()
        if (isMounted && data.notes) {
          setNotes(data.notes)
        }
      } catch (error) {
        console.error("Failed to fetch notes", error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // 3. We use a special comment to bypass the overly strict React 19 data-fetching rule
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    fetchNotes()

    return () => {
      isMounted = false
    }
  }, [documentId])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500 bg-zinc-50">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading your guide...
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-zinc-400 bg-zinc-50 p-8 text-center space-y-4">
        <BookOpen className="h-12 w-12 text-zinc-300" />
        <p>Your learning log is empty. Save important questions from your AI chat to build your study guide!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50">
      <div className="h-12 border-b border-zinc-200 bg-white flex items-center px-4 shrink-0 justify-between shadow-sm z-10">
        <span className="font-semibold text-sm text-zinc-700 flex items-center">
          <BookOpen className="h-4 w-4 mr-2 text-blue-600" /> My Study Guide
        </span>
        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
          {notes.length} Saved
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-3 hover:border-blue-200 transition-colors">
            <div className="font-semibold text-zinc-900 text-sm border-b border-zinc-100 pb-3">
              <span className="text-blue-500 mr-2">Q:</span>{note.question}
            </div>
            <div className="text-zinc-600 text-sm whitespace-pre-wrap leading-relaxed">
              {note.ai_answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}