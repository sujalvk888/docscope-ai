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

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-[#73615A] bg-[#EBE3C3] p-10 text-center space-y-8">
        <div className="h-20 w-20 bg-[#DFD6B7] border border-[#D3C9AA] rounded-full shadow-md flex items-center justify-center">
          <Layers className="h-10 w-10 text-[#DB6E4C]" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1A1515]">Flashcard Studio</h2>
          <p className="text-base max-w-sm mx-auto font-medium">Memorize key concepts instantly. Our AI will extract the most important terms and generate an interactive study deck.</p>
        </div>
        <Button onClick={generateFlashcards} disabled={isGenerating} className="px-8 py-6 rounded-2xl text-base shadow-lg bg-[#1A1515] hover:bg-[#2B2323] text-[#F5F2E8]">
          {isGenerating ? <><Loader2 className="mr-3 h-5 w-5 animate-spin text-[#DB6E4C]" /> Extracting Terms...</> : "Generate Study Deck"}
        </Button>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="flex flex-col h-full bg-[#EBE3C3]">
      <div className="h-14 border-b border-[#D3C9AA] bg-[#DFD6B7] flex items-center px-6 shrink-0 justify-between shadow-sm">
        <span className="font-bold text-base text-[#1A1515] flex items-center">
          <Layers className="h-5 w-5 mr-3 text-[#DB6E4C]" /> Deck: {flashcards.length} Cards
        </span>
        <span className="text-sm font-extrabold text-[#73615A] bg-[#EBE3C3] px-3 py-1.5 rounded-full border border-[#D3C9AA]">
          {currentIndex + 1} / {flashcards.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="relative w-full max-w-md aspect-[4/3] cursor-pointer group [perspective:1000px]" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] shadow-2xl rounded-3xl border-2 border-[#D3C9AA] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            
            {/* FRONT OF CARD (Term) */}
            <div className="absolute w-full h-full bg-[#DFD6B7] rounded-3xl [backface-visibility:hidden] flex flex-col items-center justify-center p-10 text-center">
              <button onClick={(e) => speakText(currentCard.term, e)} className="absolute top-5 right-5 p-3 text-[#73615A] hover:text-[#DB6E4C] hover:bg-[#EBE3C3] rounded-full transition-all z-10">
                <Volume2 className="h-6 w-6" />
              </button>
              <span className="text-sm font-extrabold text-[#DB6E4C] uppercase tracking-widest absolute top-8">Term</span>
              <h3 className="text-3xl font-bold text-[#1A1515] leading-tight mt-6">{currentCard.term}</h3>
              <div className="absolute bottom-8 flex items-center text-sm font-bold text-[#73615A] group-hover:text-[#DB6E4C] transition-colors">
                <RotateCw className="h-4 w-4 mr-2" /> Click to flip
              </div>
            </div>

            {/* BACK OF CARD (Definition) */}
            <div className="absolute w-full h-full bg-[#1A1515] text-[#F5F2E8] rounded-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-10 text-center border-2 border-[#1A1515]">
              <button onClick={(e) => speakText(currentCard.definition, e)} className="absolute top-5 right-5 p-3 text-[#73615A] hover:text-[#E9C85B] hover:bg-[#2B2323] rounded-full transition-all z-10">
                <Volume2 className="h-6 w-6" />
              </button>
              <span className="text-sm font-extrabold text-[#E9C85B] uppercase tracking-widest absolute top-8">Definition</span>
              <p className="text-lg sm:text-xl font-medium leading-relaxed mt-6">{currentCard.definition}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full max-w-md mt-12">
          <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0} className="w-28 py-6 rounded-xl border-[#D3C9AA] text-[#1A1515] hover:bg-[#DFD6B7] font-bold">
            <ArrowLeft className="h-5 w-5 mr-2" /> Prev
          </Button>
          <Button variant="ghost" onClick={generateFlashcards} className="text-[#73615A] hover:text-[#DB6E4C] font-bold">
            <RotateCw className="h-5 w-5 mr-2" /> Restart
          </Button>
          <Button onClick={handleNext} disabled={currentIndex === flashcards.length - 1} className="w-28 py-6 rounded-xl bg-[#DB6E4C] hover:bg-[#C25A3A] text-[#F5F2E8] font-bold shadow-md">
            Next <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}