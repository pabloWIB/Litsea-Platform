'use client'

import { useTopbarHeight } from '@/context/BannerContext'
import HeroSection from './HeroSection'
import Footer from '@/components/layout/Footer'

export default function HomeClient() {
  const topbarHeight = useTopbarHeight()

  return (
    <main className="bg-[#FDFAF5]" style={{ paddingTop: topbarHeight }}>
      <HeroSection />
      <Footer />
    </main>
  )
}
