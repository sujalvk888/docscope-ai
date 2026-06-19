import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    // Get the documentId from the URL (e.g., /api/chat/history?documentId=123)
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json({ error: "Missing documentId" }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Verify user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Fetch all saved Q&A pairs for this specific document, ordered by newest first
    const { data: notes, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ notes })
  } catch (error: unknown) {
    console.error("Fetch History Error:", error)
    return NextResponse.json({ error: "Failed to fetch study notes." }, { status: 500 })
  }
}