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
  
  // Track which messages are currently saving, and which have been successfully saved
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
        body: JSON.stringify({ 
          message: userMessage,
          documentId: documentId 
        })
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

  // NEW: Function to handle saving a Q&A pair to the database
  const handleSaveQA = async (aiIndex: number) => {
    // Grab the AI's answer, and the user's question right before it
    const aiAnswer = messages[aiIndex].content
    const question = messages[aiIndex - 1]?.content

    if (!question || !aiAnswer) return

    setSavingIndex(aiIndex)

    try {
      const response = await fetch('/api/chat/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          question,
          aiAnswer
        })
      })

      if (response.ok) {
        // Mark as saved so the UI changes to a green checkmark
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
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="h-12 border-b border-zinc-200 bg-zinc-50 flex items-center px-4 shrink-0">
        <Bot className="h-5 w-5 text-blue-500 mr-2" />
        <span className="font-semibold text-sm text-zinc-700">DocScope AI Assistant</span>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-zinc-800' : 'bg-blue-100'}`}>
              {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-blue-600" />}
            </div>
            
            {/* Message Bubble & Controls Container */}
            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
              
              <div className={`px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-zinc-800 text-white rounded-2xl rounded-tr-none' 
                  : 'bg-zinc-100 text-zinc-800 leading-relaxed rounded-2xl rounded-tl-none'
              }`}>
                {msg.content}
              </div>

              {/* NEW: Save Button (Only show for AI messages, and skip the initial greeting which has index 0) */}
              {msg.role === 'ai' && index > 0 && (
                <div className="mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-7 px-2 text-xs ${savedIndexes.includes(index) ? 'text-green-600 hover:text-green-700' : 'text-zinc-400 hover:text-blue-600'}`}
                    onClick={() => handleSaveQA(index)}
                    disabled={savingIndex === index || savedIndexes.includes(index)}
                  >
                    {savingIndex === index ? (
                      <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Saving...</>
                    ) : savedIndexes.includes(index) ? (
                      <><Check className="h-3 w-3 mr-1" /> Saved to Log</>
                    ) : (
                      <><BookmarkPlus className="h-3 w-3 mr-1" /> Save to Learning Log</>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-4">
             <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <div className="bg-zinc-100 rounded-2xl rounded-tl-none px-4 py-3 text-zinc-500 flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs font-medium">Reading document...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="p-4 border-t border-zinc-200 bg-white shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this document..." 
            className="pr-12 py-6 bg-zinc-50 border-zinc-200 focus-visible:ring-blue-500 shadow-sm"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-2 h-8 w-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full"
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-4 w-4 ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  )
}