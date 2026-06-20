'use client'

import { useState, useEffect } from 'react'
import { Loader2, Layers, ArrowRight, ArrowLeft, RotateCw, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Flashcard = { term: string; definition: string }

export function FlashcardEngine({ documentId }: { documentId: string }) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel() }
  }, [])

  const generateFlashcards = async () => {
    setIsGenerating(true); setFlashcards([]); setCurrentIndex(0); setIsFlipped(false);
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      })
      const data = await response.json()
      if (response.ok && data.flashcards) setFlashcards(data.flashcards)
      else alert("Error generating flashcards")
    } catch (error) { alert("Network error") } 
    finally { setIsGenerating(false) }
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false); if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false); if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150)
    }
  }

  const speakText = (text: string, e: React.MouseEvent) => {
    e.stopPropagation() 
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9 
      window.speechSynthesis.speak(utterance)
    }
  }

  // 1. Loading / Empty State
  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-[#73615A] bg-[#EBE3C3] p-6 sm:p-10 text-center space-y-6 sm:space-y-8 overflow-y-auto">
        <div className="h-16 w-16 sm:h-20 sm:w-20 bg-[#DFD6B7] border border-[#D3C9AA] rounded-full shadow-md flex items-center justify-center shrink-0">
          <Layers className="h-8 w-8 sm:h-10 sm:w-10 text-[#DB6E4C]" />
        </div>
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1515]">Flashcard Studio</h2>
          <p className="text-sm sm:text-base max-w-sm mx-auto font-medium">Memorize key concepts instantly. Our AI will extract the most important terms and generate an interactive study deck.</p>
        </div>
        <Button onClick={generateFlashcards} disabled={isGenerating} className="px-6 py-5 sm:px-8 sm:py-6 rounded-xl sm:rounded-2xl text-sm sm:text-base shadow-lg bg-[#1A1515] hover:bg-[#2B2323] text-[#F5F2E8]">
          {isGenerating ? <><Loader2 className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 animate-spin text-[#DB6E4C]" /> Extracting Terms...</> : "Generate Study Deck"}
        </Button>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="flex flex-col h-full bg-[#EBE3C3]">
      {/* Header */}
      <div className="h-12 sm:h-14 border-b border-[#D3C9AA] bg-[#DFD6B7] flex items-center px-4 sm:px-6 shrink-0 justify-between shadow-sm">
        <span className="font-bold text-sm sm:text-base text-[#1A1515] flex items-center">
          <Layers className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-[#DB6E4C]" /> Deck: {flashcards.length} Cards
        </span>
        <span className="text-xs sm:text-sm font-extrabold text-[#73615A] bg-[#EBE3C3] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[#D3C9AA]">
          {currentIndex + 1} / {flashcards.length}
        </span>
      </div>

      {/* CRITICAL FIX: Changed flex wrapper to allow safe scrolling from the very top.
        Removed justify-center to prevent CSS from clipping the top of the card on small mobile devices. 
      */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col items-center justify-start min-h-full w-full max-w-md mx-auto p-4 sm:p-8 pt-6 sm:pt-10">
          
          <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] min-h-[280px] cursor-pointer group [perspective:1000px] shrink-0" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] shadow-2xl rounded-2xl sm:rounded-3xl border-2 border-[#D3C9AA] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
              
              {/* FRONT OF CARD (Term) */}
              <div className="absolute w-full h-full bg-[#DFD6B7] rounded-2xl sm:rounded-3xl [backface-visibility:hidden] flex flex-col items-center justify-center p-6 sm:p-10 text-center">
                
                {/* Floating Speaker Button */}
                <button onClick={(e) => speakText(currentCard.term, e)} className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 sm:p-3 text-[#73615A] hover:text-[#DB6E4C] bg-[#EBE3C3]/60 sm:bg-transparent hover:bg-[#EBE3C3] rounded-full transition-all z-10 shadow-sm sm:shadow-none">
                  <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                
                <span className="text-xs sm:text-sm font-extrabold text-[#DB6E4C] uppercase tracking-widest absolute top-6 sm:top-8">Term</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1515] leading-tight mt-6">{currentCard.term}</h3>
                
                <div className="absolute bottom-6 sm:bottom-8 flex items-center text-xs sm:text-sm font-bold text-[#73615A] group-hover:text-[#DB6E4C] transition-colors">
                  <RotateCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Click to flip
                </div>
              </div>

              {/* BACK OF CARD (Definition) */}
              <div className="absolute w-full h-full bg-[#1A1515] text-[#F5F2E8] rounded-2xl sm:rounded-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-6 sm:p-10 text-center border-2 border-[#1A1515]">
                
                {/* Floating Speaker Button */}
                <button onClick={(e) => speakText(currentCard.definition, e)} className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 sm:p-3 text-[#73615A] hover:text-[#E9C85B] bg-[#2B2323]/60 sm:bg-transparent hover:bg-[#2B2323] rounded-full transition-all z-10 shadow-sm sm:shadow-none">
                  <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                
                <span className="text-xs sm:text-sm font-extrabold text-[#E9C85B] uppercase tracking-widest absolute top-6 sm:top-8">Definition</span>
                
                {/* Scrollable Definition Wrapper to prevent massive cards on long AI outputs */}
                <div className="mt-10 mb-4 w-full flex-1 overflow-y-auto no-scrollbar flex items-center justify-center">
                  <p className="text-base sm:text-xl font-medium leading-relaxed">{currentCard.definition}</p>
                </div>
                
                <div className="flex items-center text-xs sm:text-sm font-bold text-[#73615A] hover:text-[#E9C85B] transition-colors mt-auto">
                  <RotateCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Click to flip
                </div>
              </div>

            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full mt-6 sm:mt-10 shrink-0 gap-2">
            <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0} className="w-full max-w-[100px] sm:max-w-[112px] py-5 sm:py-6 rounded-xl border-[#D3C9AA] text-[#1A1515] hover:bg-[#DFD6B7] font-bold px-2">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 shrink-0" /> Prev
            </Button>
            <Button variant="ghost" onClick={generateFlashcards} className="text-[#73615A] hover:text-[#DB6E4C] font-bold px-2 sm:px-4 text-xs sm:text-sm">
              <RotateCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 shrink-0" /> Restart
            </Button>
            <Button onClick={handleNext} disabled={currentIndex === flashcards.length - 1} className="w-full max-w-[100px] sm:max-w-[112px] py-5 sm:py-6 rounded-xl bg-[#DB6E4C] hover:bg-[#C25A3A] text-[#F5F2E8] font-bold shadow-md px-2">
              Next <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2 shrink-0" />
            </Button>
          </div>
          
        </div>
      </div>

    </div>
  )
}