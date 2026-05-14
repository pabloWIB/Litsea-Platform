import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  UserPlus,
  LayoutDashboard,
  Send,
  MessageCircle,
  Building2,
  FileText,
  Users,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cómo funciona',
    description:
      'Guía completa de Litsea Empleos. Aprende cómo los terapeutas consiguen trabajo en hoteles y spas de lujo en la Riviera Maya y cómo los empleadores contratan talento certificado.',
    alternates: { canonical: '/como-funciona' },
    openGraph: {
      title: 'Cómo funciona Litsea Empleos — Guía paso a paso',
      description:
        'Conectamos terapeutas certificados con hoteles y spas de lujo en la Riviera Maya. Proceso transparente, gratuito para terapeutas.',
    },
  }
}

const T_ICONS = [UserPlus, LayoutDashboard, Send, MessageCircle]
const E_ICONS = [Building2, FileText, Users, ShieldCheck]


export default async function ComoFuncionaPage() {
  const t = await getTranslations('comoFuncionaPage')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        name: 'Cómo conseguir trabajo en un spa de lujo en México',
        description: t('forTerapeutasSubtitle'),
        step: [
          { '@type': 'HowToStep', position: 1, name: t('step1TTitle'), text: t('step1TDesc') },
          { '@type': 'HowToStep', position: 2, name: t('step2TTitle'), text: t('step2TDesc') },
          { '@type': 'HowToStep', position: 3, name: t('step3TTitle'), text: t('step3TDesc') },
          { '@type': 'HowToStep', position: 4, name: t('step4TTitle'), text: t('step4TDesc') },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'Cómo contratar terapeutas certificados para un hotel o spa',
        description: t('forEmpleadoresSubtitle'),
        step: [
          { '@type': 'HowToStep', position: 1, name: t('step1ETitle'), text: t('step1EDesc') },
          { '@type': 'HowToStep', position: 2, name: t('step2ETitle'), text: t('step2EDesc') },
          { '@type': 'HowToStep', position: 3, name: t('step3ETitle'), text: t('step3EDesc') },
          { '@type': 'HowToStep', position: 4, name: t('step4ETitle'), text: t('step4EDesc') },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: t('q1'), acceptedAnswer: { '@type': 'Answer', text: t('a1') } },
          { '@type': 'Question', name: t('q2'), acceptedAnswer: { '@type': 'Answer', text: t('a2') } },
          { '@type': 'Question', name: t('q3'), acceptedAnswer: { '@type': 'Answer', text: t('a3') } },
          { '@type': 'Question', name: t('q4'), acceptedAnswer: { '@type': 'Answer', text: t('a4') } },
          { '@type': 'Question', name: t('q5'), acceptedAnswer: { '@type': 'Answer', text: t('a5') } },
          { '@type': 'Question', name: t('q6'), acceptedAnswer: { '@type': 'Answer', text: t('a6') } },
        ],
      },
    ],
  }

  const tSteps = [
    { key: '1T', title: t('step1TTitle'), desc: t('step1TDesc'), Icon: T_ICONS[0] },
    { key: '2T', title: t('step2TTitle'), desc: t('step2TDesc'), Icon: T_ICONS[1] },
    { key: '3T', title: t('step3TTitle'), desc: t('step3TDesc'), Icon: T_ICONS[2] },
    { key: '4T', title: t('step4TTitle'), desc: t('step4TDesc'), Icon: T_ICONS[3] },
  ]

  const eSteps = [
    { key: '1E', title: t('step1ETitle'), desc: t('step1EDesc'), Icon: E_ICONS[0] },
    { key: '2E', title: t('step2ETitle'), desc: t('step2EDesc'), Icon: E_ICONS[1] },
    { key: '3E', title: t('step3ETitle'), desc: t('step3EDesc'), Icon: E_ICONS[2] },
    { key: '4E', title: t('step4ETitle'), desc: t('step4EDesc'), Icon: E_ICONS[3] },
  ]

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
    { q: t('q6'), a: t('a6') },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-[#071210] px-4 py-14 md:py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">
            {t('badge')}
          </p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-[0.95] mb-4">
            {t('title')}<br />
            <span className="text-[#2FB7A3]">{t('titleAccent')}</span>
          </h1>
          <p className="text-sm text-white/50 max-w-lg">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4">

        <div className="py-10 md:py-12 border-b border-neutral-100">
          <p className="text-base text-neutral-700 leading-relaxed">
            {t('intro')}
          </p>
        </div>

        <section className="py-12 md:py-16 border-b border-neutral-100">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#2FB7A3] font-bold mb-2">
              {t('forTerapeutasLabel')}
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 leading-tight mb-2">
              {t('forTerapeutasTitle')}
            </h2>
            <p className="text-sm text-neutral-500">{t('forTerapeutasSubtitle')}</p>
          </div>

          <StepList steps={tSteps} />

          <div className="mt-8">
            <Link
              href="/registro-terapeuta"
              className="inline-flex items-center justify-center rounded-full bg-[#2FB7A3] px-6 py-3 text-sm font-semibold text-white ring-offset-2 transition duration-200 hover:ring-2 hover:ring-[#2FB7A3]"
            >
              {t('ctaTerapeuta')}
            </Link>
          </div>
        </section>

        <section className="py-12 md:py-16 border-b border-neutral-100">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#2FB7A3] font-bold mb-2">
              {t('forEmpleadoresLabel')}
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 leading-tight mb-2">
              {t('forEmpleadoresTitle')}
            </h2>
            <p className="text-sm text-neutral-500">{t('forEmpleadoresSubtitle')}</p>
          </div>

          <StepList steps={eSteps} />

          <div className="mt-8">
            <Link
              href="/registro-empleador"
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              {t('ctaEmpleador')}
            </Link>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#2FB7A3] font-bold mb-2">
              {t('faqLabel')}
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 leading-tight mb-1">
              {t('faqTitle')}
            </h2>
            <p className="text-sm text-neutral-500">{t('faqSubtitle')}</p>
          </div>

          <div className="divide-y divide-neutral-100 border-t border-neutral-100">
            {faqs.map(({ q, a }, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px] font-semibold text-neutral-800">{q}</span>
                  <ChevronDown className="size-4 shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="pb-5 text-sm text-neutral-600 leading-relaxed pr-8">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </section>

      </div>

      <section className="bg-[#071210] px-4 py-14 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">
            Litsea Empleos
          </p>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-[0.95] mb-3">
            {t('ctaTitle')}
          </h2>
          <p className="text-sm text-white/50 mb-8 max-w-md mx-auto">
            {t('ctaSubtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/registro-terapeuta"
              className="inline-flex items-center justify-center rounded-full bg-[#2FB7A3] px-7 py-3 text-sm font-semibold text-white ring-offset-2 transition duration-200 hover:ring-2 hover:ring-[#2FB7A3]"
            >
              {t('ctaTerapeuta')}
            </Link>
            <Link
              href="/registro-empleador"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-7 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white/12"
            >
              {t('ctaEmpleador')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

type Step = {
  key: string
  title: string
  desc: string
  Icon: React.ElementType
}

function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => (
        <li key={step.key} className="flex gap-5">
          <div className="flex flex-col items-center shrink-0">
            <div className="flex items-center justify-center size-10 rounded-full bg-[#2FB7A3]/10 border border-[#2FB7A3]/25 text-[#2FB7A3] font-black text-sm tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 bg-neutral-100 my-2" />
            )}
          </div>

          <div className={`pb-8 ${i === steps.length - 1 ? 'pb-0' : ''}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <step.Icon className="size-4 text-[#2FB7A3]" />
              <h3 className="text-[15px] font-bold text-neutral-900">{step.title}</h3>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">{step.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
