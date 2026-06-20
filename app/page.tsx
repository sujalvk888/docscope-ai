import Image from 'next/image'
import logo from '@/app/Images/logo.png'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, Highlighter, BarChart3, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#1A1515] text-[#F5F2E8] overflow-hidden font-sans z-0">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#91361D] rounded-full blur-[100px] sm:blur-[150px] opacity-40 mix-blend-screen pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-[#5F170D] rounded-full blur-[80px] sm:blur-[120px] opacity-50 mix-blend-screen pointer-events-none -z-10" />

      {/* Floating Pill Navigation */}
      <div className="fixed top-4 sm:top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <header className="w-full max-w-5xl bg-[#1A1515]/70 backdrop-blur-xl border border-[#F5F2E8]/10 rounded-full px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between shadow-2xl pointer-events-auto">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Image 
              src={logo} 
              alt="DocScope AI Logo" 
              width={24} 
              height={24} 
              className="rounded-md object-contain sm:w-[28px] sm:h-[28px]"
            />
            <span className="font-bold text-lg sm:text-xl tracking-tight text-[#F5F2E8]">
              DocScope AI
            </span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[#F5F2E8]/80 hover:text-[#E9C85B] hover:bg-[#F5F2E8]/5 text-xs sm:text-base rounded-full px-3 sm:px-4 hidden min-[350px]:flex">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#DB6E4C] hover:bg-[#C25A3A] text-[#F5F2E8] shadow-[0_0_20px_-5px_#DB6E4C] rounded-full text-xs sm:text-base px-4 sm:px-6 border border-[#DB6E4C]/50 h-8 sm:h-10">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-6 pt-32 sm:pt-40 pb-16 sm:pb-20 text-center flex flex-col items-center z-10">
        
        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#F5F2E8]/5 border border-[#F5F2E8]/10 backdrop-blur-md rounded-full px-4 sm:px-5 py-1.5 sm:py-2 mb-6 sm:mb-8 shadow-lg">
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-[#E9C85B]" />
          <span className="text-xs sm:text-sm font-medium text-[#F5F2E8]/90 tracking-wide">
            The next generation of document learning
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-[#F5F2E8] leading-[1.1] mb-6 sm:mb-8">
          Turn ordinary documents into an <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E9C85B] to-[#DB6E4C]">
            intelligent learning experience
          </span>
        </h1>
        
        <p className="text-[#F5F2E8]/70 text-base sm:text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-10">
          Don&apos;t just read PDFs. Chat with them, highlight key insights, and generate instant quizzes in one premium visual workspace.
        </p>

        <div className="relative group w-full sm:w-auto">
          {/* Subtle glow behind the button */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#EBE3C3] to-[#E9C85B] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500" />
          <Link href="/signup" className="relative block w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-[#EBE3C3] hover:bg-[#F5F2E8] text-[#1A1515] px-10 h-14 text-lg font-bold rounded-full transition-transform duration-300 hover:scale-[1.02]">
              Get Started <ArrowRight className="ml-3 h-5 w-5 text-[#DB6E4C]" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 sm:py-24 w-full z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { 
              icon: Bot, 
              title: "Advanced AI Chat", 
              desc: "Factual answers rooted strictly in your documents. Zero hallucinations.",
              color: "from-[#DB6E4C]"
            },
            { 
              icon: Highlighter, 
              title: "Smart Highlights", 
              desc: "Compile custom learning logs dynamically as you interact with the text.",
              color: "from-[#E9C85B]"
            },
            { 
              icon: BarChart3, 
              title: "Quiz Generation", 
              desc: "Test your retention with custom evaluations and interactive flashcards.",
              color: "from-[#91361D]"
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="group relative bg-[#1A1515]/50 backdrop-blur-xl border border-[#F5F2E8]/10 p-6 sm:p-8 lg:p-10 rounded-[2rem] shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Subtle animated top border gradient on hover */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="p-3 sm:p-4 bg-[#F5F2E8]/5 border border-[#F5F2E8]/10 rounded-2xl w-fit text-[#F5F2E8] group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <feature.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#F5F2E8] mt-6 sm:mt-8 mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-[#F5F2E8]/60 text-sm sm:text-base leading-relaxed font-light">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}