import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, BookOpen, GraduationCap, History, ArrowRight, Trash2, BrainCircuit } from 'lucide-react'
import { UploadButton } from '@/components/workspace/upload-button'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  async function deleteDocument(formData: FormData) {
    'use server'
    const documentId = formData.get('documentId') as string
    if (!documentId) return
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()
    if (!user) return

    await supabaseServer
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', user.id) 

    revalidatePath('/dashboard')
  }

  const { data: documents } = await supabase.from('documents').select('*').order('created_at', { ascending: false })
  const { data: quizResults } = await supabase.from('quiz_results').select('score, total_questions')
  const { count: studyNotesCount } = await supabase.from('chat_history').select('*', { count: 'exact', head: true })

  let averageScore = 0
  let hasQuizzes = false

  if (quizResults && quizResults.length > 0) {
    hasQuizzes = true
    const totalCorrect = quizResults.reduce((acc, curr) => acc + curr.score, 0)
    const totalPossible = quizResults.reduce((acc, curr) => acc + curr.total_questions, 0)
    averageScore = Math.round((totalCorrect / totalPossible) * 100)
  }

  return (
    <div className="min-h-screen bg-[#EBE3C3] text-[#2B1C18] font-sans">
      {/* Dashboard Nav */}
      <header className="border-b border-[#D3C9AA] bg-[#DFD6B7] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BrainCircuit className="h-6 w-6 text-[#DB6E4C]" />
            <span className="font-bold text-xl text-[#1A1515]">DocScope</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-[#73615A]">{user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <Button variant="outline" size="sm" className="rounded-lg hover:bg-[#EBE3C3]">Sign Out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Welcome Area */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-[#1A1515] p-10 rounded-3xl shadow-xl">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F5F2E8]">Welcome to your Workspace</h1>
            <p className="text-[#DFD6B7] text-lg">Transform your current material into an AI interactive learning hub.</p>
          </div>
          <UploadButton userId={user.id} />
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-[#73615A] uppercase tracking-wider">Documents Studied</CardTitle>
              <FileText className="h-5 w-5 text-[#DB6E4C]" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-[#1A1515]">{documents?.length || 0}</div>
              <p className="text-sm text-[#73615A] mt-2 font-medium">Total uploaded files</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-[#E9C85B]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-[#73615A] uppercase tracking-wider">Average Quiz Score</CardTitle>
              <GraduationCap className="h-5 w-5 text-[#E9C85B]" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-[#1A1515]">{hasQuizzes ? `${averageScore}%` : '--%'}</div>
              <p className="text-sm text-[#73615A] mt-2 font-medium">
                {hasQuizzes ? `Based on ${quizResults?.length} completed quizzes` : 'No quizzes taken yet'}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-[#73615A] uppercase tracking-wider">Saved Study Notes</CardTitle>
              <BookOpen className="h-5 w-5 text-[#DB6E4C]" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-[#1A1515]">{studyNotesCount || 0}</div>
              <p className="text-sm text-[#73615A] mt-2 font-medium">Total interactions logged</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent History Segment */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center space-x-3 text-[#1A1515] font-bold text-2xl">
            <History className="h-6 w-6 text-[#DB6E4C]" />
            <h2>Document History</h2>
          </div>

          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="relative group hover:-translate-y-1 transition-transform duration-300">
                  <form action={deleteDocument} className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input type="hidden" name="documentId" value={doc.id} />
                    <Button 
                      type="submit" 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-[#73615A] hover:text-[#F5F2E8] hover:bg-[#5F170D] rounded-full transition-colors"
                      title="Delete Workspace"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>

                  <CardHeader className="pb-4 pr-14">
                    <CardTitle className="text-lg font-bold truncate text-[#1A1515]" title={doc.file_name}>
                      {doc.file_name}
                    </CardTitle>
                    <p className="text-sm text-[#73615A] font-medium mt-1">
                      Uploaded {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/workspace/${doc.id}`}>
                      <Button variant="secondary" className="w-full justify-between px-6 rounded-xl">
                        Open Workspace <ArrowRight className="h-4 w-4 text-[#E9C85B]" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#D3C9AA] rounded-3xl p-16 text-center bg-[#DFD6B7]/50">
              <p className="text-[#73615A] text-lg font-medium">Your learning repository is empty. Upload your first document to launch a workspace session.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}