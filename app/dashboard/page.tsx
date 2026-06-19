import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, BookOpen, GraduationCap, History, ArrowRight, Trash2 } from 'lucide-react'
import { UploadButton } from '@/components/workspace/upload-button'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // 1. Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ====================================================================
  // SERVER ACTION FOR DELETION (Now with X-Ray Error Logging!)
  // ====================================================================
  async function deleteDocument(formData: FormData) {
    'use server'
    console.log("\n--- ATTEMPTING TO DELETE DOCUMENT ---")
    
    const documentId = formData.get('documentId') as string
    if (!documentId) return

    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()
    if (!user) return

    console.log("1. Deleting document ID:", documentId)

    // Attempt the deletion
    const { error } = await supabaseServer
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', user.id) 

    if (error) {
      console.error("🚨 SUPABASE DELETION ERROR:", error.message)
    } else {
      console.log("✅ Document and all cascades successfully deleted!")
    }
    console.log("-------------------------------------\n")

    // Refresh the dashboard page instantly
    revalidatePath('/dashboard')
  }

  // 2. Fetch the user's documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  // 3. Fetch the user's quiz results for analytics
  const { data: quizResults } = await supabase
    .from('quiz_results')
    .select('score, total_questions')

  // 4. Fetch the user's total study notes saved
  const { count: studyNotesCount } = await supabase
    .from('chat_history')
    .select('*', { count: 'exact', head: true })

  // Calculate the Average Quiz Score
  let averageScore = 0
  let hasQuizzes = false

  if (quizResults && quizResults.length > 0) {
    hasQuizzes = true
    const totalCorrect = quizResults.reduce((acc, curr) => acc + curr.score, 0)
    const totalPossible = quizResults.reduce((acc, curr) => acc + curr.total_questions, 0)
    averageScore = Math.round((totalCorrect / totalPossible) * 100)
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Dashboard Nav */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg text-zinc-900">DocScope Workspace</span>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-zinc-500">{user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <Button variant="outline" size="sm">Sign Out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome Area */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to your Dashboard</h1>
            <p className="text-zinc-500">Transform your current material into an AI interactive workspace.</p>
          </div>
          <UploadButton userId={user.id} />
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-zinc-200/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Documents Studied</CardTitle>
              <FileText className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents?.length || 0}</div>
              <p className="text-xs text-zinc-400 mt-1">Total uploaded files</p>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Average Quiz Score</CardTitle>
              <GraduationCap className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hasQuizzes ? `${averageScore}%` : '--%'}</div>
              <p className="text-xs text-zinc-400 mt-1">
                {hasQuizzes ? `Based on ${quizResults?.length} completed quizzes` : 'No quizzes taken yet'}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Saved Study Notes</CardTitle>
              <BookOpen className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyNotesCount || 0}</div>
              <p className="text-xs text-zinc-400 mt-1">Total interactions logged</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent History Segment */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-zinc-700 font-semibold text-lg">
            <History className="h-5 w-5 text-zinc-400" />
            <h2>Document History</h2>
          </div>

          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="bg-white border border-zinc-200 hover:border-blue-400 transition-colors relative group">
                  
                  <form action={deleteDocument} className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input type="hidden" name="documentId" value={doc.id} />
                    <Button 
                      type="submit" 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete Workspace"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>

                  <CardHeader className="pb-3 pr-12">
                    <CardTitle className="text-base font-semibold truncate" title={doc.file_name}>
                      {doc.file_name}
                    </CardTitle>
                    <p className="text-xs text-zinc-400">
                      Uploaded on {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/workspace/${doc.id}`}>
                      <Button variant="secondary" className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900">
                        Open Workspace <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border border-zinc-200 border-dashed rounded-2xl p-12 text-center bg-white">
              <p className="text-zinc-400 text-sm">Your learning repository is empty. Upload your first document to launch a workspace session.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}