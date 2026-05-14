'use client'

import { useTopbarHeight } from '@/context/BannerContext'
import HeroSection from './HeroSection'
import VacantesDestacadas from './VacantesDestacadas'
import TerapeutasDestacados from './TerapeutasDestacados'
import RedEmpleadores from './RedEmpleadores'
import HowItWorksSection from './HowItWorksSection'
import ParaEmpleadoresSection from './ParaEmpleadoresSection'
import OpinionesSection from './OpinionesSection'
import CtaSectionHome from './CtaSectionHome'
import Footer from '@/components/layout/Footer'

export default function HomeClient() {
  const topbarHeight = useTopbarHeight()

  return (
    <main className="bg-[#FDFAF5]" style={{ paddingTop: topbarHeight }}>
      <HeroSection />
      <section id="vacantes">
        <VacantesDestacadas />
      </section>
      <section id="terapeutas">
        <TerapeutasDestacados />
      </section>
      <section id="empleadores">
        <RedEmpleadores />
        <ParaEmpleadoresSection />
      </section>
      <section id="como-funciona">
        <HowItWorksSection />
      </section>
      <OpinionesSection />
      <CtaSectionHome />
      <Footer />
    </main>
  )
}
