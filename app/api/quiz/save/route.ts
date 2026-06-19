import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  console.log("\n--- STARTING QUIZ SCORE SAVE ---")
  try {
    const body = await request.json()
    console.log("1. Save Request Received:", body)

    const { documentId, score, totalQuestions } = body

    // THE FIX: We explicitly check for 'number' so a score of 0 doesn't fail validation!
    if (!documentId || typeof score !== 'number' || typeof totalQuestions !== 'number') {
      console.log("🚨 ERROR: Validation failed. Missing or invalid fields.")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Verify the user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.log("🚨 ERROR: Unauthorized User.")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Insert the score into the database
    console.log("2. Inserting into database...")
    const { error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: user.id,
        document_id: documentId,
        score: score,
        total_questions: totalQuestions
      })

    if (error) throw error

    console.log("3. Score Saved Successfully!")
    console.log("--------------------------------\n")
    return NextResponse.json({ success: true })
    
  } catch (error: unknown) {
    console.error("🚨 Save Quiz Error:", error)
    return NextResponse.json({ error: "Failed to save quiz score." }, { status: 500 })
  }
}