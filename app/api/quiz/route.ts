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
  console.log("\n--- STARTING QUIZ GENERATION ---")
  try {
    const body = await request.json()
    console.log("1. Generation Request Received:", body)

    const { documentId } = body

    if (!documentId) {
      console.log("🚨 ERROR: documentId is missing from the request!")
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    // 1. Fetch document from DB
    const supabase = await createClient()
    const { data: document, error: dbError } = await supabase
      .from('documents').select('*').eq('id', documentId).single()

    if (dbError || !document) {
        console.log("🚨 ERROR: Document not found in DB.")
        return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // 2. Download and Extract Text
    console.log("2. Downloading PDF...")
    const fileResponse = await fetch(document.file_url)
    if (!fileResponse.ok) throw new Error("Failed to download PDF.")

    const arrayBuffer = await fileResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    console.log("3. Extracting Text...")
    const extractedText = await extractTextFromPDF(buffer)
    const safeText = extractedText.substring(0, 15000)

    const systemPrompt = `
      You are an expert educational evaluator. 
      Create a 3-question multiple-choice quiz based STRICTLY on the provided text.
      You MUST output ONLY a valid JSON object. 
      Do NOT include any conversational text, markdown formatting, or explanations outside the JSON.

      Use this EXACT JSON structure:
      {
        "questions": [
          {
            "question": "The question text...",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "The exact string of the correct option",
            "explanation": "A short explanation of why this is correct based on the text."
          }
        ]
      }

      DOCUMENT TEXT:
      ---
      ${safeText}
      ---
    `

    console.log("4. Requesting Groq AI Quiz...")
    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }],
      // THE FIX: Changed to the active Llama 3.1 8B model
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      response_format: { type: "json_object" } 
    })

    const quizJsonString = completion.choices[0]?.message?.content
    
    if (!quizJsonString) throw new Error("AI failed to generate quiz.")

    const quizData = JSON.parse(quizJsonString)
    console.log("5. Quiz Generated Successfully!")
    console.log("--------------------------------\n")
    
    return NextResponse.json(quizData)

  } catch (error: unknown) {
    console.error("🚨 Quiz Generation Error:", error)
    return NextResponse.json({ error: "Failed to generate evaluation." }, { status: 500 })
  }
}