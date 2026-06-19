import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PdfViewerWrapper } from '@/components/workspace/pdf-viewer-wrapper'
import { WorkspacePanel } from '@/components/workspace/workspace-panel'

export default async function WorkspacePage({ params }: { params: { id: string } }) {
  // Await the params object before using its properties to comply with Next.js 15+ standards
  const resolvedParams = await params
  const supabase = await createClient()

  // 1. Verify User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Fetch the specific document based on the URL ID
  const { data: document, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !document) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2>Document not found.</h2>
        <Link href="/dashboard"><Button className="mt-4">Back to Dashboard</Button></Link>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-50 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-zinc-200 bg-white flex items-center px-4 justify-between shrink-0">
        
        {/* Left Side: Back Button & Title */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <div className="h-4 w-px bg-zinc-300" />
          <h1 className="font-semibold text-sm text-zinc-800 truncate max-w-[300px]" title={document.file_name}>
            {document.file_name}
          </h1>
        </div>

        {/* Right Side: Export Action */}
        <div className="flex items-center">
          <Link href={`/workspace/${document.id}/export`} target="_blank">
            <Button variant="outline" size="sm" className="text-zinc-600 hover:text-blue-600 hover:bg-blue-50 border-zinc-200 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export Progress
            </Button>
          </Link>
        </div>
      </header>

      {/* The Split Screen */}
      <main className="flex-1 flex overflow-hidden">
        {/* LEFT SIDE: PDF Viewer Wrapper (60% width) */}
        <section className="w-[60%] h-full border-r border-zinc-200 bg-zinc-100 relative overflow-hidden">
          <PdfViewerWrapper fileUrl={document.file_url} />
        </section>

        {/* RIGHT SIDE: Interactive Workspace Panel (40% width) */}
        <section className="w-[40%] h-full bg-white flex flex-col relative shadow-[-4px_0_24px_-16px_rgba(0,0,0,0.1)] z-10">
          <WorkspacePanel documentId={document.id} />
        </section>
      </main>
    </div>
  )
}