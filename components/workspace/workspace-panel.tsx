'use client'

import { useState } from 'react'
import { MessageSquare, BookOpen, GraduationCap, Layers } from 'lucide-react'
import { AiChat } from './ai-chat'
import { StudyNotes } from './study-notes'
import { QuizEngine } from './quiz-engine'
import { FlashcardEngine } from './flashcard-engine'

export function WorkspacePanel({ documentId }: { documentId: string }) {
  // Added 'flashcards' to our tracking state
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'quiz' | 'flashcards'>('chat')

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tab Navigation Menu */}
      <div className="flex items-center p-2 bg-zinc-100 border-b border-zinc-200 shrink-0 gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 min-w-[80px] whitespace-nowrap flex items-center justify-center px-2 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'chat' 
              ? 'bg-white text-blue-600 shadow-sm border border-zinc-200/50' 
              : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Chat
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 min-w-[80px] whitespace-nowrap flex items-center justify-center px-2 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'notes' 
              ? 'bg-white text-blue-600 shadow-sm border border-zinc-200/50' 
              : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Notes
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 min-w-[80px] whitespace-nowrap flex items-center justify-center px-2 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'quiz' 
              ? 'bg-white text-blue-600 shadow-sm border border-zinc-200/50' 
              : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5 mr-1.5" /> Quiz
        </button>
        {/* NEW: Flashcards Tab Button */}
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 min-w-[90px] whitespace-nowrap flex items-center justify-center px-2 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'flashcards' 
              ? 'bg-white text-blue-600 shadow-sm border border-zinc-200/50' 
              : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'
          }`}
        >
          <Layers className="h-3.5 w-3.5 mr-1.5" /> Cards
        </button>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className={`h-full ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
          <div className="[&>div>div:first-child]:hidden h-full">
            <AiChat documentId={documentId} />
          </div>
        </div>
        
        <div className={`h-full ${activeTab === 'notes' ? 'block' : 'hidden'}`}>
          <StudyNotes documentId={documentId} />
        </div>

        <div className={`h-full ${activeTab === 'quiz' ? 'block' : 'hidden'}`}>
          <QuizEngine documentId={documentId} />
        </div>

        {/* NEW: Flashcard Component */}
        <div className={`h-full ${activeTab === 'flashcards' ? 'block' : 'hidden'}`}>
          <FlashcardEngine documentId={documentId} />
        </div>
      </div>
    </div>
  )
}