'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, Loader2, BookmarkPlus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Message = {
  role: 'ai' | 'user'
  content: string
}

export function AiChat({ documentId }: { documentId: string }) {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [savingIndex, setSavingIndex] = useState<number | null>(null)
  const [savedIndexes, setSavedIndexes] = useState<number[]>([])
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I have loaded your document into my memory. What would you like to know about it?' }
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, documentId: documentId })
      })

      const data = await response.json()

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "Error: " + data.error }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Network error occurred." }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSaveQA = async (aiIndex: number) => {
    const aiAnswer = messages[aiIndex].content
    const question = messages[aiIndex - 1]?.content

    if (!question || !aiAnswer) return
    setSavingIndex(aiIndex)

    try {
      const response = await fetch('/api/chat/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, question, aiAnswer })
      })

      if (response.ok) {
        setSavedIndexes(prev => [...prev, aiIndex])
      } else {
        alert("Failed to save to learning log.")
      }
    } catch (error) {
      alert("Network error while saving.")
    } finally {
      setSavingIndex(null)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#EBE3C3]">
      {/* Chat Header */}
      <div className="h-12 sm:h-14 border-b border-[#D3C9AA] bg-[#DFD6B7] flex items-center px-4 sm:px-6 shrink-0 z-10 shadow-sm">
        <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-[#DB6E4C] mr-2 sm:mr-3" />
        <span className="font-bold text-sm sm:text-base text-[#1A1515]">InfiDocs AI Assistant</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            
            {/* Avatar */}
            <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-md ${msg.role === 'user' ? 'bg-[#1A1515]' : 'bg-[#DB6E4C]'}`}>
              {msg.role === 'user' ? <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#F5F2E8]" /> : <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-[#F5F2E8]" />}
            </div>
            
            {/* Message Content */}
            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[90%] sm:max-w-[85%]`}>
              <div className={`px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base whitespace-pre-wrap shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#1A1515] text-[#F5F2E8] rounded-2xl sm:rounded-3xl rounded-tr-sm' 
                  : 'bg-[#DFD6B7] text-[#2B1C18] border border-[#D3C9AA] leading-relaxed rounded-2xl sm:rounded-3xl rounded-tl-sm'
              }`}>
                {msg.content}
              </div>

              {/* Save to Log Button */}
              {msg.role === 'ai' && index > 0 && (
                <div className="mt-2 sm:mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs font-bold rounded-lg ${savedIndexes.includes(index) ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-[#73615A] hover:text-[#DB6E4C] hover:bg-[#DFD6B7]'}`}
                    onClick={() => handleSaveQA(index)}
                    disabled={savingIndex === index || savedIndexes.includes(index)}
                  >
                    {savingIndex === index ? (
                      <><Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-spin" /> Saving...</>
                    ) : savedIndexes.includes(index) ? (
                      <><Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Saved to Log</>
                    ) : (
                      <><BookmarkPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Save to Learning Log</>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 sm:gap-4">
             <div className="h-8 w-8 sm:h-10 sm:w-10 bg-[#DB6E4C] rounded-full flex items-center justify-center shrink-0 mt-1 shadow-md">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-[#F5F2E8]" />
            </div>
            <div className="bg-[#DFD6B7] border border-[#D3C9AA] rounded-2xl sm:rounded-3xl rounded-tl-sm px-4 sm:px-6 py-3 sm:py-4 text-[#73615A] flex items-center space-x-2 sm:space-x-3 shadow-sm">
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-[#DB6E4C]" />
              <span className="text-xs sm:text-sm font-bold">Analyzing document...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-5 border-t border-[#D3C9AA] bg-[#DFD6B7] shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center w-full">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this document..." 
            className="pr-14 sm:pr-16 pl-4 sm:pl-5 py-6 sm:py-7 bg-[#EBE3C3] border-[#D3C9AA] text-[#1A1515] placeholder:text-[#73615A] focus-visible:ring-[#DB6E4C] shadow-inner text-sm sm:text-base rounded-xl sm:rounded-2xl w-full"
            disabled={isTyping}
          />
          
          {/* Send Button (Optically Centered) */}
          <Button 
            type="submit" 
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 bg-[#DB6E4C] hover:bg-[#C25A3A] text-[#F5F2E8] rounded-lg sm:rounded-xl shadow-md flex items-center justify-center p-0 transition-transform active:scale-95"
            disabled={!input.trim() || isTyping}
          >
            {/* The ml-[2px] mt-[2px] nudges the paper plane to the optical center! */}
            <Send className="h-4 w-4 sm:h-5 sm:w-5 ml-[2px] mt-[2px]" />
          </Button>
        </form>
      </div>
    </div>
  )
}