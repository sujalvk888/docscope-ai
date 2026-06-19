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
    setIsGenerating(true)
    setQuestions([])
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setIsFinished(false)

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      })

      const data = await response.json()
      
      if (response.ok && data.questions) {
        setQuestions(data.questions)
      } else {
        alert("Error generating quiz: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      alert("Network error while generating quiz.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer !== null) return 
    
    setSelectedAnswer(option)
    
    if (option === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  // UPDATED: Now saves the score to the database when the quiz finishes!
  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
    } else {
      setIsFinished(true)
      
      // Fire and forget: Save score in the background
      try {
        await fetch('/api/quiz/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            documentId, 
            score, 
            totalQuestions: questions.length 
          })
        })
      } catch (error) {
        console.error("Failed to save quiz results to database.")
      }
    }
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-zinc-600 bg-zinc-50 p-8 text-center space-y-6">
        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
          <GraduationCap className="h-8 w-8 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-zinc-900">Knowledge Evaluation</h2>
          <p className="text-sm max-w-sm mx-auto">
            Ready to test your retention? Our AI will instantly generate a custom multiple-choice exam based on this document.
          </p>
        </div>
        <Button 
          onClick={generateQuiz} 
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
        >
          {isGenerating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Document...</>
          ) : (
            "Generate AI Quiz"
          )}
        </Button>
      </div>
    )
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="flex flex-col h-full items-center justify-center text-zinc-600 bg-zinc-50 p-8 text-center space-y-6">
        <div className="h-24 w-24 rounded-full border-8 flex items-center justify-center text-2xl font-bold border-blue-500 text-blue-600">
          {percentage}%
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-zinc-900">Quiz Completed!</h2>
          <p className="text-sm">You scored {score} out of {questions.length} correctly.</p>
        </div>
        <Button onClick={generateQuiz} variant="outline" className="text-zinc-700">
          <RefreshCw className="mr-2 h-4 w-4" /> Retake with New Questions
        </Button>
      </div>
    )
  }

  const currentQ = questions[currentIndex]

  return (
    <div className="flex flex-col h-full bg-zinc-50">
      <div className="h-12 border-b border-zinc-200 bg-white flex items-center px-4 shrink-0 justify-between shadow-sm">
        <span className="font-semibold text-sm text-zinc-700 flex items-center">
          <GraduationCap className="h-4 w-4 mr-2 text-blue-600" /> Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-xs font-bold text-zinc-500">
          Score: {score}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <h3 className="text-lg font-semibold text-zinc-900 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, i) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentQ.correctAnswer
            
            let btnStyle = "bg-white border-zinc-200 hover:border-blue-300 text-zinc-700"
            if (selectedAnswer) {
              if (isCorrect) btnStyle = "bg-green-50 border-green-500 text-green-900"
              else if (isSelected) btnStyle = "bg-red-50 border-red-500 text-red-900"
              else btnStyle = "bg-white border-zinc-100 text-zinc-400 opacity-50"
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${btnStyle}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{option}</span>
                  {selectedAnswer && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 ml-2" />}
                  {selectedAnswer && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500 shrink-0 ml-2" />}
                </div>
              </button>
            )
          })}
        </div>

        {selectedAnswer && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-6 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Explanation</h4>
            <p className="text-sm text-blue-900 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {selectedAnswer && (
        <div className="p-4 border-t border-zinc-200 bg-white shrink-0">
          <Button onClick={handleNextQuestion} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
            {currentIndex < questions.length - 1 ? (
              <>Next Question <ArrowRight className="ml-2 h-4 w-4" /></>
            ) : (
              "View Results"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}