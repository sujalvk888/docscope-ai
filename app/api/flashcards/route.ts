import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createClient } from '@/lib/supabase/server'

// Initialize Groq securely
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PDFParser = require('pdf2json')
    const pdfParser = new PDFParser(null, 1)

    pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) => reject(errData.parserError))
    pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()))
    pdfParser.parseBuffer(buffer)
  })
}

export async function POST(request: Request) {
  console.log("\n--- STARTING FLASHCARD GENERATION/FETCH ---")
  try {
    const body = await request.json()
    const { documentId } = body

    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Verify the user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ====================================================================
    // NEW COST-SAVING LOGIC: Check database for existing flashcards first!
    // ====================================================================
    console.log("1. Checking database for existing flashcards...")
    const { data: existingDeck } = await supabase
      .from('flashcard_decks')
      .select('flashcards')
      .eq('document_id', documentId)
      .single()

    if (existingDeck && existingDeck.flashcards) {
      console.log("✅ Flashcards found in database! Saving API tokens.")
      console.log("-----------------------------------\n")
      // We instantly return the saved deck, bypassing the expensive AI generation!
      return NextResponse.json({ flashcards: existingDeck.flashcards })
    }

    console.log("❌ No flashcards found. Proceeding with AI generation.")

    // ====================================================================
    // PROCEED WITH GROQ AI GENERATION
    // ====================================================================
    const { data: document, error: dbError } = await supabase
      .from('documents').select('*').eq('id', documentId).single()

    if (dbError || !document) {
        return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    console.log("2. Downloading PDF...")
    const fileResponse = await fetch(document.file_url)
    if (!fileResponse.ok) throw new Error("Failed to download PDF.")

    const arrayBuffer = await fileResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    console.log("3. Extracting Text...")
    const extractedText = await extractTextFromPDF(buffer)
    const safeText = extractedText.substring(0, 15000)

    const systemPrompt = `
      You are an expert study aid creator. 
      Analyze the provided text and identify the 10 most important key terms, concepts, or acronyms.
      Generate a flashcard deck for memorization.
      You MUST output ONLY a valid JSON object. 
      Do NOT include any conversational text, markdown formatting, or explanations outside the JSON.

      Use this EXACT JSON structure:
      {
        "flashcards": [
          {
            "term": "The core concept or word",
            "definition": "A clear, concise, 1-2 sentence definition based on the text."
          }
        ]
      }

      DOCUMENT TEXT:
      ---
      ${safeText}
      ---
    `

    console.log("4. Requesting Groq AI Flashcards...")
    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      response_format: { type: "json_object" } 
    })

    const flashcardJsonString = completion.choices[0]?.message?.content
    
    if (!flashcardJsonString) throw new Error("AI failed to generate flashcards.")

    const flashcardData = JSON.parse(flashcardJsonString)
    console.log("5. Flashcards Generated Successfully!")

    // ====================================================================
    // NEW: SAVE THE GENERATED DECK TO THE DATABASE FOREVER
    // ====================================================================
    console.log("6. Saving new deck to database...")
    const { error: insertError } = await supabase
      .from('flashcard_decks')
      .insert({
        user_id: user.id,
        document_id: documentId,
        flashcards: flashcardData.flashcards
      })

    if (insertError) {
      console.error("Warning: Failed to save flashcards to DB.", insertError)
    } else {
      console.log("✅ Deck securely stored for future use.")
    }

    console.log("-----------------------------------\n")
    return NextResponse.json(flashcardData)

  } catch (error: unknown) {
    console.error("🚨 Flashcard Generation Error:", error)
    return NextResponse.json({ error: "Failed to generate flashcards." }, { status: 500 })
  }
}