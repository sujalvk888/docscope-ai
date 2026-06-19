import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, FileText, BrainCircuit, Highlighter, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    // Removed bg-zinc-950 and text-zinc-50 to allow Layout to dictate theme
    <div className="flex flex-col min-h-screen">
      
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
              <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm">Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.15]">
          Turn ordinary documents into an{' '}
          <span className="text-blue-600">intelligent learning experience</span>
        </h1>
        
        <p className="text-zinc-600 text-lg md:text-xl max-w-2xl mx-auto">
          Don&apos;t just read PDFs. Chat with them, highlight key insights, and generate instant quizzes in one visual workspace.
        </p>

        <div className="pt-4">
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 shadow-sm">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Bot, title: "Advanced AI Chat", desc: "Factual answers rooted in your documents." },
            { icon: Highlighter, title: "Smart Highlights", desc: "Compile custom learning logs dynamically." },
            { icon: BarChart3, title: "Quiz Generation", desc: "Test retention with custom evaluations." }
          ].map((feature, i) => (
            <div key={i} className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm space-y-4">
              <div className="p-3 bg-zinc-100 rounded-xl w-fit text-blue-600"><feature.icon className="h-6 w-6" /></div>
              <h3 className="text-xl font-bold text-zinc-900">{feature.title}</h3>
              <p className="text-zinc-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}