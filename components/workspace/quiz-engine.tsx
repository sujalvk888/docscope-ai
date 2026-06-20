'use client'

import { useState } from 'react'
import { Loader2, GraduationCap, CheckCircle2, XCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Question = {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export function QuizEngine({ documentId }: { documentId: string }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const generateQuiz = async () => {
    setIsGenerating(true); setQuestions([]); setCurrentIndex(0); setSelectedAnswer(null); setScore(0); setIsFinished(false);
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      })
      const data = await response.json()
      if (response.ok && data.questions) setQuestions(data.questions)
      else alert("Error generating quiz: " + (data.error || "Unknown error"))
    } catch (error) {
      alert("Network error while generating quiz.")
    } finally { setIsGenerating(false) }
  }

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer !== null) return 
    setSelectedAnswer(option)
    if (option === questions[currentIndex].correctAnswer) setScore(prev => prev + 1)
  }

  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1); setSelectedAnswer(null);
    } else {
      setIsFinished(true)
      try {
        await fetch('/api/quiz/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId, score, totalQuestions: questions.length })
        })
      } catch (error) { console.error("Failed to save quiz results.") }
    }
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-[#73615A] bg-[#EBE3C3] p-10 text-center space-y-8">
        <div className="h-20 w-20 bg-[#DFD6B7] border border-[#D3C9AA] rounded-full shadow-md flex items-center justify-center">
          <GraduationCap className="h-10 w-10 text-[#E9C85B]" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1A1515]">Knowledge Evaluation</h2>
          <p className="text-base max-w-sm mx-auto font-medium">Ready to test your retention? Our AI will instantly generate a custom exam based on this document.</p>
        </div>
        <Button onClick={generateQuiz} disabled={isGenerating} className="px-8 py-6 rounded-2xl text-base shadow-lg bg-[#1A1515] hover:bg-[#2B2323] text-[#F5F2E8]">
          {isGenerating ? <><Loader2 className="mr-3 h-5 w-5 animate-spin text-[#E9C85B]" /> Analyzing Document...</> : "Generate AI Quiz"}
        </Button>
      </div>
    )
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="flex flex-col h-full items-center justify-center text-[#73615A] bg-[#EBE3C3] p-10 text-center space-y-8">
        <div className="h-32 w-32 rounded-full border-[10px] flex items-center justify-center text-4xl font-extrabold border-[#E9C85B] text-[#1A1515] shadow-xl bg-[#DFD6B7]">
          {percentage}%
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-[#1A1515]">Quiz Completed!</h2>
          <p className="text-lg font-medium">You scored {score} out of {questions.length} correctly.</p>
        </div>
        <Button onClick={generateQuiz} variant="outline" className="px-6 py-6 rounded-xl border-[#D3C9AA] text-[#1A1515] hover:bg-[#DFD6B7]">
          <RefreshCw className="mr-3 h-5 w-5" /> Retake with New Questions
        </Button>
      </div>
    )
  }

  const currentQ = questions[currentIndex]

  return (
    <div className="flex flex-col h-full bg-[#EBE3C3]">
      <div className="h-14 border-b border-[#D3C9AA] bg-[#DFD6B7] flex items-center px-6 shrink-0 justify-between shadow-sm">
        <span className="font-bold text-base text-[#1A1515] flex items-center">
          <GraduationCap className="h-5 w-5 mr-3 text-[#DB6E4C]" /> Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-sm font-extrabold text-[#73615A] bg-[#EBE3C3] px-3 py-1.5 rounded-full border border-[#D3C9AA]">Score: {score}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <h3 className="text-xl font-bold text-[#1A1515] leading-relaxed">{currentQ.question}</h3>
        <div className="space-y-4">
          {currentQ.options.map((option, i) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentQ.correctAnswer
            
            let btnStyle = "bg-[#DFD6B7] border-[#D3C9AA] hover:border-[#DB6E4C] text-[#2B1C18]"
            if (selectedAnswer) {
              if (isCorrect) btnStyle = "bg-[#E9C85B]/20 border-[#E9C85B] text-[#1A1515] shadow-md"
              else if (isSelected) btnStyle = "bg-[#5F170D] border-[#5F170D] text-[#F5F2E8] shadow-md"
              else btnStyle = "bg-[#DFD6B7] border-[#D3C9AA] text-[#73615A] opacity-50"
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 font-medium text-base ${btnStyle}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedAnswer && isCorrect && <CheckCircle2 className="h-6 w-6 text-[#1A1515] shrink-0 ml-3" />}
                  {selectedAnswer && isSelected && !isCorrect && <XCircle className="h-6 w-6 text-[#E9C85B] shrink-0 ml-3" />}
                </div>
              </button>
            )
          })}
        </div>

        {selectedAnswer && (
          <div className="bg-[#DFD6B7] border-2 border-[#DB6E4C]/50 rounded-2xl p-6 mt-8 animate-in fade-in slide-in-from-bottom-4 shadow-sm">
            <h4 className="text-sm font-bold text-[#DB6E4C] uppercase tracking-wider mb-2">Explanation</h4>
            <p className="text-base text-[#2B1C18] leading-relaxed font-medium">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {selectedAnswer && (
        <div className="p-6 border-t border-[#D3C9AA] bg-[#DFD6B7] shrink-0">
          <Button onClick={handleNextQuestion} className="w-full py-6 text-base rounded-xl bg-[#1A1515] hover:bg-[#2B2323] text-[#F5F2E8] shadow-lg">
            {currentIndex < questions.length - 1 ? <>Next Question <ArrowRight className="ml-3 h-5 w-5 text-[#E9C85B]" /></> : "View Results"}
          </Button>
        </div>
      )}
    </div>
  )
}