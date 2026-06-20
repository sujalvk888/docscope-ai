import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PdfViewerWrapper } from '@/components/workspace/pdf-viewer-wrapper'
import { WorkspacePanel } from '@/components/workspace/workspace-panel'

export default async function WorkspacePage({ params }: { params: { id: string } }) {
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#EBE3C3] text-[#2B1C18]">
        <h2 className="text-xl font-bold">Document not found.</h2>
        <Link href="/dashboard"><Button className="mt-4">Back to Dashboard</Button></Link>
      </div>
    )
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-[#EBE3C3] overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <header className="h-14 sm:h-16 border-b border-[#D3C9AA] bg-[#DFD6B7] flex items-center px-4 sm:px-6 justify-between shrink-0 shadow-sm z-20">
        
        {/* Left Side: Back Button & Title */}
        <div className="flex items-center space-x-3 sm:space-x-5 overflow-hidden">
          <Link href="/dashboard" className="shrink-0">
            <Button variant="ghost" size="sm" className="text-[#73615A] hover:text-[#1A1515] hover:bg-[#EBE3C3] rounded-lg px-2 sm:px-3">
              <ArrowLeft className="h-4 w-4 sm:mr-2" /> 
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div className="h-6 w-px bg-[#D3C9AA] shrink-0" />
          <h1 className="font-bold text-sm sm:text-base text-[#1A1515] truncate max-w-[150px] sm:max-w-[300px] md:max-w-[400px]" title={document.file_name}>
            {document.file_name}
          </h1>
        </div>

        {/* Right Side: Export Action */}
        <div className="flex items-center shrink-0 pl-2">
          <Link href={`/workspace/${document.id}/export`} target="_blank">
            <Button variant="outline" size="sm" className="text-[#1A1515] hover:text-[#F5F2E8] hover:bg-[#DB6E4C] border-[#DB6E4C] transition-colors rounded-xl shadow-sm px-3 sm:px-4">
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export Progress</span>
              <span className="inline sm:hidden">Export</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* The Split Screen (Responsive Stacked on Mobile, Side-by-side on Desktop) */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT SIDE (Top on Mobile): PDF Viewer Wrapper */}
        <section className="w-full h-[40%] lg:w-[60%] lg:h-full border-b lg:border-b-0 lg:border-r border-[#D3C9AA] bg-[#DFD6B7] relative overflow-hidden shrink-0 lg:shrink">
          <PdfViewerWrapper fileUrl={document.file_url} />
        </section>

        {/* RIGHT SIDE (Bottom on Mobile): Interactive Workspace Panel */}
        <section className="w-full h-[60%] lg:w-[40%] lg:h-full bg-[#EBE3C3] flex flex-col relative shadow-[0_-8px_30px_-15px_rgba(26,21,21,0.1)] lg:shadow-[-12px_0_30px_-15px_rgba(26,21,21,0.1)] z-10 shrink-0 lg:shrink">
          <WorkspacePanel documentId={document.id} />
        </section>
      </main>
    </div>
  )
}