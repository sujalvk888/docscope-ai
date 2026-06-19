import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { documentId, question, aiAnswer } = await request.json()

    if (!documentId || !question || !aiAnswer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()
    
    // 1. Verify the user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Insert the saved Q&A into the database
    const { error } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        document_id: documentId,
        question: question,
        ai_answer: aiAnswer
      })

    if (error) throw error

    return NextResponse.json({ success: true })
    
  } catch (error: unknown) {
    console.error("Save Chat Error:", error)
    return NextResponse.json({ error: "Failed to save to learning log." }, { status: 500 })
  }
}