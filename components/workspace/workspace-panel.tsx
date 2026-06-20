'use client'

import { useState } from 'react'
import { MessageSquare, BookOpen, GraduationCap, Layers } from 'lucide-react'
import { AiChat } from './ai-chat'
import { StudyNotes } from './study-notes'
import { QuizEngine } from './quiz-engine'
import { FlashcardEngine } from './flashcard-engine'

export function WorkspacePanel({ documentId }: { documentId: string }) {
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'quiz' | 'flashcards'>('chat')

  return (
    <div className="h-full flex flex-col bg-[#EBE3C3]">
      {/* Tab Navigation Menu */}
      <div className="flex items-center p-3 bg-[#DFD6B7] border-b border-[#D3C9AA] shrink-0 gap-2 overflow-x-auto no-scrollbar shadow-sm z-20">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 min-w-[90px] whitespace-nowrap flex items-center justify-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
            activeTab === 'chat' 
              ? 'bg-[#1A1515] text-[#F5F2E8] shadow-md' 
              : 'text-[#73615A] hover:text-[#1A1515] hover:bg-[#EBE3C3]/60'
          }`}
        >
          <MessageSquare className="h-4 w-4 mr-2" /> Chat
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 min-w-[90px] whitespace-nowrap flex items-center justify-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
            activeTab === 'notes' 
              ? 'bg-[#1A1515] text-[#F5F2E8] shadow-md' 
              : 'text-[#73615A] hover:text-[#1A1515] hover:bg-[#EBE3C3]/60'
          }`}
        >
          <BookOpen className="h-4 w-4 mr-2" /> Notes
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 min-w-[90px] whitespace-nowrap flex items-center justify-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
            activeTab === 'quiz' 
              ? 'bg-[#1A1515] text-[#F5F2E8] shadow-md' 
              : 'text-[#73615A] hover:text-[#1A1515] hover:bg-[#EBE3C3]/60'
          }`}
        >
          <GraduationCap className="h-4 w-4 mr-2" /> Quiz
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 min-w-[90px] whitespace-nowrap flex items-center justify-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
            activeTab === 'flashcards' 
              ? 'bg-[#1A1515] text-[#F5F2E8] shadow-md' 
              : 'text-[#73615A] hover:text-[#1A1515] hover:bg-[#EBE3C3]/60'
          }`}
        >
          <Layers className="h-4 w-4 mr-2" /> Cards
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

        <div className={`h-full ${activeTab === 'flashcards' ? 'block' : 'hidden'}`}>
          <FlashcardEngine documentId={documentId} />
        </div>
      </div>
    </div>
  )
}