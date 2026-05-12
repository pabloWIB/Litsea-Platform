'use client'

import Footer from '@/components/layout/Footer'
import { useTopbarHeight } from '@/context/BannerContext'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const topbarHeight = useTopbarHeight()

  return (
    <div className="min-h-screen bg-[#FDFAF5] flex flex-col">
      <main
        className="flex-1"
        style={{ paddingTop: topbarHeight }}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
