'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LoginPageShell } from './LoginPageShell'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { Stethoscope, Building2 } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE, delay },
})

export default function LoginSelectorClient() {
  return (
    <LoginPageShell>
      <motion.div {...fadeUp(0.45)} className="text-center">
        <h1 className="text-[1.7rem] font-semibold tracking-tight text-white leading-tight">
          ¿Cómo quieres ingresar?
        </h1>
        <p className="mt-1.5 text-[0.88rem] text-white/45 leading-relaxed">
          Selecciona tu tipo de cuenta para continuar
        </p>
      </motion.div>

      <div className="mt-8 flex flex-col gap-3">
        <motion.div {...fadeUp(0.55)}>
          <Link href="/login/terapeuta">
            <HoverBorderGradient
              as="div"
              containerClassName="w-full cursor-pointer"
              backdropClassName="bg-[#2FB7A3]"
              className="w-full flex items-center gap-4 px-5 py-4 text-left"
            >
              <div className="flex items-center justify-center size-10 rounded-xl bg-white/20 shrink-0">
                <Stethoscope className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">Soy terapeuta</p>
                <p className="text-[11px] text-white/70 mt-0.5">Busco trabajo en spas y hoteles</p>
              </div>
            </HoverBorderGradient>
          </Link>
        </motion.div>

        <motion.div {...fadeUp(0.63)}>
          <Link href="/login/empleador">
            <HoverBorderGradient
              as="div"
              containerClassName="w-full cursor-pointer border-white/15"
              backdropClassName="bg-white/8"
              className="w-full flex items-center gap-4 px-5 py-4 text-left"
            >
              <div className="flex items-center justify-center size-10 rounded-xl bg-white/10 shrink-0">
                <Building2 className="size-5 text-white/70" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">Soy empleador</p>
                <p className="text-[11px] text-white/50 mt-0.5">Represento un hotel o spa</p>
              </div>
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </div>

      <motion.div {...fadeUp(0.75)} className="mt-8 flex flex-col gap-2 text-center">
        <p className="text-[12px] text-white/30">
          ¿Eres terapeuta egresado?{' '}
          <Link href="/registro-terapeuta" className="text-[#2FB7A3] hover:text-[#3ecfbb] transition-colors font-medium">
            Crea tu cuenta gratis
          </Link>
        </p>
        <p className="text-[12px] text-white/30">
          ¿Representas un hotel o spa?{' '}
          <Link href="/registro-empleador" className="text-[#2FB7A3] hover:text-[#3ecfbb] transition-colors font-medium">
            Registra tu empresa
          </Link>
        </p>
      </motion.div>
    </LoginPageShell>
  )
}
