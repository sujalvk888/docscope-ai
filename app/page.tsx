import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, BrainCircuit, Highlighter, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#5F170D] to-[#91361D] text-[#F5F2E8]">
      
      {/* Navigation Header */}
      <header className="border-b border-[#F5F2E8]/10 bg-[#1A1515]/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BrainCircuit className="h-7 w-7 text-[#E9C85B]" />
            <span className="font-bold text-2xl tracking-tight text-[#F5F2E8]">
              DocScope AI
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/login">
              <Button variant="ghost" className="text-[#F5F2E8] hover:text-[#E9C85B] hover:bg-[#F5F2E8]/5 text-base">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#DB6E4C] hover:bg-[#C25A3A] text-[#F5F2E8] shadow-lg rounded-xl text-base px-6">Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-center space-y-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#F5F2E8] leading-[1.15]">
          Turn ordinary documents into an{' '}
          <span className="text-[#E9C85B]">intelligent learning experience</span>
        </h1>
        
        <p className="text-[#F5F2E8]/80 text-lg md:text-2xl max-w-2xl mx-auto font-light">
          Don&apos;t just read PDFs. Chat with them, highlight key insights, and generate instant quizzes in one premium visual workspace.
        </p>

        <div className="pt-8">
          <Link href="/signup">
            <Button size="lg" className="bg-[#EBE3C3] hover:bg-[#DFD6B7] text-[#1A1515] px-10 h-14 text-lg rounded-2xl shadow-xl transition-transform hover:scale-105">
              Get Started <ArrowRight className="ml-3 h-5 w-5 text-[#DB6E4C]" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Bot, title: "Advanced AI Chat", desc: "Factual answers rooted in your documents. No hallucinations." },
            { icon: Highlighter, title: "Smart Highlights", desc: "Compile custom learning logs dynamically as you read." },
            { icon: BarChart3, title: "Quiz Generation", desc: "Test retention with custom evaluations and flashcards." }
          ].map((feature, i) => (
            <div key={i} className="bg-[#1A1515]/60 backdrop-blur-sm border border-[#F5F2E8]/10 p-10 rounded-3xl shadow-2xl space-y-5 hover:bg-[#1A1515]/80 transition-colors">
              <div className="p-4 bg-[#DB6E4C]/20 rounded-2xl w-fit text-[#DB6E4C]"><feature.icon className="h-7 w-7" /></div>
              <h3 className="text-2xl font-bold text-[#F5F2E8]">{feature.title}</h3>
              <p className="text-[#F5F2E8]/70 text-base leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}