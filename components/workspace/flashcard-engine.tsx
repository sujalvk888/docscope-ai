'use client'

import { useState, useEffect } from 'react'
import { Loader2, Layers, ArrowRight, ArrowLeft, RotateCw, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Flashcard = {
  term: string
  definition: string
}

export function FlashcardEngine({ documentId }: { documentId: string }) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // Clean up any playing audio if the user leaves the tab
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const generateFlashcards = async () => {
    setIsGenerating(true)
    setFlashcards([])
    setCurrentIndex(0)
    setIsFlipped(false)

    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      })

      const data = await response.json()
      
      if (response.ok && data.flashcards) {
        setFlashcards(data.flashcards)
      } else {
        alert("Error generating flashcards: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      alert("Network error while generating flashcards.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false)
      // Stop any audio that is currently playing when moving to next card
      if ('speechSynthesis' in window) window.speechSynthesis.cancel() 
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150) 
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150)
    }
  }

  // NEW: The Web Speech API Integration
  const speakText = (text: string, e: React.MouseEvent) => {
    // This stops the click from bubbling up and flipping the card!
    e.stopPropagation() 

    if ('speechSynthesis' in window) {
      // Cancel any currently speaking audio first
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      // You can adjust the voice, pitch, and rate here if you want!
      utterance.rate = 0.9 
      
      window.speechSynthesis.speak(utterance)
    } else {
      alert("Sorry, your browser doesn't support text-to-speech!")
    }
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-zinc-600 bg-zinc-50 p-8 text-center space-y-6">
        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Layers className="h-8 w-8 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-zinc-900">Flashcard Studio</h2>
          <p className="text-sm max-w-sm mx-auto">
            Memorize key concepts instantly. Our AI will extract the most important terms and generate an interactive study deck.
          </p>
        </div>
        <Button 
          onClick={generateFlashcards} 
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
        >
          {isGenerating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting Terms...</>
          ) : (
            "Generate Study Deck"
          )}
        </Button>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="flex flex-col h-full bg-zinc-50">
      <div className="h-12 border-b border-zinc-200 bg-white flex items-center px-4 shrink-0 justify-between shadow-sm">
        <span className="font-semibold text-sm text-zinc-700 flex items-center">
          <Layers className="h-4 w-4 mr-2 text-blue-600" /> Deck: {flashcards.length} Cards
        </span>
        <span className="text-xs font-bold text-zinc-500">
          {currentIndex + 1} / {flashcards.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        
        <div 
          className="relative w-full max-w-md aspect-[4/3] cursor-pointer group [perspective:1000px]"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] shadow-xl rounded-2xl border border-zinc-200 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            
            {/* FRONT OF CARD (Term) */}
            <div className="absolute w-full h-full bg-white rounded-2xl [backface-visibility:hidden] flex flex-col items-center justify-center p-8 text-center">
              
              {/* NEW: Audio Button for Term */}
              <button 
                onClick={(e) => speakText(currentCard.term, e)}
                className="absolute top-4 right-4 p-2.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all z-10"
                title="Listen to Term"
              >
                <Volume2 className="h-5 w-5" />
              </button>

              <span className="text-sm font-bold text-blue-500 uppercase tracking-widest absolute top-6">Term</span>
              <h3 className="text-2xl font-bold text-zinc-900 leading-tight mt-4">
                {currentCard.term}
              </h3>
              <div className="absolute bottom-6 flex items-center text-xs text-zinc-400 group-hover:text-blue-500 transition-colors">
                <RotateCw className="h-3 w-3 mr-1" /> Click to flip
              </div>
            </div>

            {/* BACK OF CARD (Definition) */}
            <div className="absolute w-full h-full bg-zinc-800 text-white rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-8 text-center">
              
              {/* NEW: Audio Button for Definition */}
              <button 
                onClick={(e) => speakText(currentCard.definition, e)}
                className="absolute top-4 right-4 p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full transition-all z-10"
                title="Listen to Definition"
              >
                <Volume2 className="h-5 w-5" />
              </button>

              <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest absolute top-6">Definition</span>
              <p className="text-base sm:text-lg font-medium leading-relaxed mt-4">
                {currentCard.definition}
              </p>
            </div>

          </div>
        </div>

        <div className="flex items-center justify-between w-full max-w-md mt-10">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="w-24 border-zinc-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Prev
          </Button>

          <Button 
            variant="ghost" 
            onClick={generateFlashcards}
            className="text-zinc-500 hover:text-blue-600"
          >
            <RotateCw className="h-4 w-4 mr-2" /> Restart
          </Button>

          <Button 
            onClick={handleNext} 
            disabled={currentIndex === flashcards.length - 1}
            className="w-24 bg-blue-600 hover:bg-blue-500 text-white"
          >
            Next <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

      </div>
    </div>
  )
}