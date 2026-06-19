import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createClient } from '@/lib/supabase/server'

// Initialize Groq securely on the server
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// =======================================================================
// PURE NODE.JS PDF TEXT EXTRACTOR
// Uses pdf2json to avoid Canvas/Worker issues in Next.js
// =======================================================================
const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PDFParser = require('pdf2json')

    const pdfParser = new PDFParser(null, 1)

    pdfParser.on('pdfParser_dataError', (errData: { parserError: Error }) => {
      reject(errData.parserError)
    })

    pdfParser.on('pdfParser_dataReady', () => {
      resolve(pdfParser.getRawTextContent())
    })

    pdfParser.parseBuffer(buffer)
  })
}

export async function POST(request: Request) {
  try {
    const { message, documentId } = await request.json()

    if (!message || !documentId) {
      return NextResponse.json({ error: 'Message and Document ID are required' }, { status: 400 })
    }

    // Find document in database
    const supabase = await createClient()

    const { data: document, error: dbError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (dbError || !document) {
      return NextResponse.json({ error: 'Document not found in database' }, { status: 404 })
    }

    console.log('\n--- STARTING AI DOCUMENT ANALYSIS ---')
    console.log('1. PDF URL:', document.file_url)

    // Download PDF
    const fileResponse = await fetch(document.file_url)

    if (!fileResponse.ok) {
      throw new Error('Failed to download PDF from Supabase.')
    }

    const arrayBuffer = await fileResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log('2. File Size Downloaded:', buffer.length, 'bytes')

    // Extract PDF text
    console.log('3. Extracting Text with pdf2json...')

    const extractedText = await extractTextFromPDF(buffer)

    console.log('4. Extraction Complete! Characters found:', extractedText.length)
    console.log('-------------------------------------\n')

    // Limit document size for AI context window
    const safeText = extractedText.substring(0, 15000)

    const systemPrompt = `
You are DocScope AI, an intelligent learning assistant.
Your ONLY job is to answer the user's questions based strictly on the text provided below.

Rules:
- Do NOT invent answers.
- Do NOT use outside knowledge.
- Do NOT make assumptions.
- If the answer is not present in the document, reply exactly:
"I'm sorry, I cannot find the answer to that in the current document."

DOCUMENT TEXT:
---
${safeText}
---
`

    // Ask Groq using the new, officially supported 3.1 model
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      // THE FIX: Changed to the active Llama 3.1 8B model
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
    })

    const reply = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."

    return NextResponse.json({ reply })
  } catch (error: unknown) {
    console.error('Groq API Error:', error)
    return NextResponse.json({ error: 'Failed to process the document or connect to AI engine.' }, { status: 500 })
  }
}