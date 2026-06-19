'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Because this file has 'use client' at the top, Next.js allows us to use ssr: false here!
const PdfViewer = dynamic(
  () => import('./pdf-viewer').then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex flex-col items-center justify-center space-y-4 bg-zinc-100 text-zinc-500">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p>Booting up PDF engine...</p>
      </div>
    ),
  }
)

export function PdfViewerWrapper({ fileUrl }: { fileUrl: string }) {
  return <PdfViewer fileUrl={fileUrl} />
}