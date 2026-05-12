'use client'

import { useTopbarHeight } from '@/context/BannerContext'

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const topbarHeight = useTopbarHeight()

  return (
    <main
      className="bg-[#FDFAF5]"
      style={{ paddingTop: topbarHeight, transition: 'padding-top 0.5s cubic-bezier(0.22,1,0.36,1)' }}
    >
      {children}
    </main>
  )
}
