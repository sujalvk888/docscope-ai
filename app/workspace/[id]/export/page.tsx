import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, FileText, BrainCircuit, Highlighter, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* Navigation Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl tracking-tight text-zinc-900">
              DocScope AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 bg-white border border-zinc-200 shadow-sm rounded-full px-4 py-1.5 text-sm text-zinc-600">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-medium">Next-Gen Document Learning Platform</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] text-zinc-900">
          Turn ordinary documents into an{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            intelligent learning experience
          </span>
        </h1>
        
        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
          Don&apos;t just read PDFs. Chat with them, highlight key insights, generate instant quizzes, and track your learning streak—all in one visual workspace.
        </p>

        <div className="flex items-center justify-center space-x-4 pt-4">
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 h-12 text-base shadow-sm">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Workflow Timeline Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-sm uppercase tracking-wider font-bold text-center mb-8 text-zinc-400">The Core Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center text-sm relative">
          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm font-medium text-zinc-700">Upload PDF/TXT</div>
          <div className="flex items-center justify-center text-zinc-300 hidden md:flex">➔</div>
          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm font-medium text-zinc-700">AI Interactive Chat</div>
          <div className="flex items-center justify-center text-zinc-300 hidden md:flex">➔</div>
          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm font-medium text-zinc-700">Highlight & Quiz</div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-zinc-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-xl w-fit text-blue-600 border border-blue-100">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Advanced AI Chat</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Ask questions and get factual answers rooted strictly inside your uploaded documentation. No hallucinations.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-cyan-50 rounded-xl w-fit text-cyan-600 border border-cyan-100">
              <Highlighter className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Smart Highlights</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Select key sentences on the PDF interface. Save them permanently to compile custom learning logs dynamically.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 p-8 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-indigo-50 rounded-xl w-fit text-indigo-600 border border-indigo-100">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Quiz Generation</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Test your retention by generating custom multiple-choice evaluation exams directly from the document material.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}