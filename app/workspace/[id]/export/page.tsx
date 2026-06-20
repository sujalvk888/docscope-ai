import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrintButton } from '@/components/workspace/print-button'
import { BookOpen, Layers, GraduationCap } from 'lucide-react'

// Defined the strict type to satisfy ESLint
type Flashcard = {
  term: string
  definition: string
}

export default async function ExportPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: document } = await supabase.from('documents').select('*').eq('id', resolvedParams.id).single()
  if (!document) return <div className="p-10 text-[#2B1C18] bg-[#EBE3C3] min-h-screen">Document not found.</div>

  const { data: notes } = await supabase.from('chat_history').select('*').eq('document_id', resolvedParams.id).order('created_at', { ascending: true })
  const { data: flashcardDeck } = await supabase.from('flashcard_decks').select('*').eq('document_id', resolvedParams.id).single()
  const { data: quizzes } = await supabase.from('quiz_results').select('*').eq('document_id', resolvedParams.id)

  let averageScore = 0
  if (quizzes && quizzes.length > 0) {
    const totalCorrect = quizzes.reduce((acc, curr) => acc + curr.score, 0)
    const totalPossible = quizzes.reduce((acc, curr) => acc + curr.total_questions, 0)
    averageScore = Math.round((totalCorrect / totalPossible) * 100)
  }

  return (
    <div className="min-h-screen bg-[#DFD6B7] p-8 print:p-0 print:bg-white font-sans text-[#2B1C18]">
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <p className="text-[#73615A] text-sm font-bold uppercase tracking-wider">Review your learning summary. Click Save as PDF when ready.</p>
        <PrintButton />
      </div>

      <div className="max-w-4xl mx-auto bg-[#EBE3C3] p-12 rounded-3xl shadow-xl print:shadow-none print:p-4 border border-[#D3C9AA]">
        <div className="border-b-2 border-[#D3C9AA] pb-8 mb-10">
          <h1 className="text-4xl font-extrabold mb-3 text-[#1A1515]">Learning Summary Report</h1>
          <h2 className="text-2xl text-[#DB6E4C] mb-8 font-semibold">{document.file_name}</h2>
          <div className="flex gap-6 text-sm text-[#73615A] font-bold uppercase tracking-wider">
            <span className="flex items-center"><BookOpen className="h-5 w-5 mr-2 text-[#E9C85B]" /> {notes?.length || 0} Notes</span>
            <span className="flex items-center"><Layers className="h-5 w-5 mr-2 text-[#E9C85B]" /> {flashcardDeck?.flashcards?.length || 0} Flashcards</span>
            <span className="flex items-center"><GraduationCap className="h-5 w-5 mr-2 text-[#E9C85B]" /> {averageScore}% Quiz Avg</span>
          </div>
        </div>

        {notes && notes.length > 0 && (
          <div className="mb-14">
            <h3 className="text-2xl font-bold border-b-2 border-[#D3C9AA]/50 pb-3 mb-6 flex items-center text-[#1A1515]">
              <BookOpen className="h-6 w-6 mr-3 text-[#DB6E4C]" /> Captured Q&A Notes
            </h3>
            <div className="space-y-6">
              {notes.map((note, index) => (
                <div key={note.id} className="bg-[#DFD6B7] p-6 rounded-2xl border border-[#D3C9AA] print:border-gray-300 print:break-inside-avoid shadow-sm">
                  <div className="font-bold text-[#1A1515] mb-3 text-lg">Q{index + 1}: {note.question}</div>
                  <div className="text-[#2B1C18] text-base leading-relaxed font-medium">{note.ai_answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {flashcardDeck && flashcardDeck.flashcards && (
          <div className="mb-14">
            <h3 className="text-2xl font-bold border-b-2 border-[#D3C9AA]/50 pb-3 mb-6 flex items-center text-[#1A1515]">
              <Layers className="h-6 w-6 mr-3 text-[#DB6E4C]" /> Extracted Key Terms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* REPLACED 'any' WITH 'Flashcard' TYPE HERE */}
              {flashcardDeck.flashcards.map((card: Flashcard, index: number) => (
                <div key={index} className="bg-[#DFD6B7] p-5 rounded-2xl border border-[#D3C9AA] print:border-gray-300 print:break-inside-avoid shadow-sm">
                  <h4 className="font-bold text-[#1A1515] mb-2 text-lg">{card.term}</h4>
                  <p className="text-base text-[#2B1C18] leading-relaxed font-medium">{card.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {quizzes && quizzes.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold border-b-2 border-[#D3C9AA]/50 pb-3 mb-6 flex items-center text-[#1A1515]">
              <GraduationCap className="h-6 w-6 mr-3 text-[#DB6E4C]" /> Evaluation History
            </h3>
            <div className="overflow-hidden border border-[#D3C9AA] rounded-2xl shadow-sm">
              <table className="min-w-full divide-y divide-[#D3C9AA] text-left">
                <thead className="bg-[#DFD6B7]">
                  <tr>
                    <th className="px-6 py-4 font-bold text-[#1A1515]">Attempt Date</th>
                    <th className="px-6 py-4 font-bold text-[#1A1515]">Score</th>
                    <th className="px-6 py-4 font-bold text-[#1A1515]">Total Questions</th>
                    <th className="px-6 py-4 font-bold text-[#1A1515]">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3C9AA] bg-[#EBE3C3]">
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id}>
                      <td className="px-6 py-4 text-[#2B1C18] font-medium">{new Date(quiz.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold text-[#1A1515]">{quiz.score}</td>
                      <td className="px-6 py-4 text-[#2B1C18] font-medium">{quiz.total_questions}</td>
                      <td className="px-6 py-4 font-extrabold text-[#DB6E4C]">{Math.round((quiz.score / quiz.total_questions) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}