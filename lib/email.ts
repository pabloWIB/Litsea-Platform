import { Resend } from 'resend'
import { render } from '@react-email/components'
import ChatEnabledEmail from '@/emails/ChatEnabledEmail'
import ApplicationStatusEmail from '@/emails/ApplicationStatusEmail'
import type { ApplicationStatus } from '@/types/database'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM ?? 'informes@litseacc.edu.mx'
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://empleos.litseacc.edu.mx'

export async function sendChatEnabledEmails({
  therapistEmail,
  therapistName,
  employerEmail,
  employerName,
  vacancyTitle,
}: {
  therapistEmail: string
  therapistName: string
  employerEmail: string
  employerName: string
  vacancyTitle: string
}) {
  const therapistHtml = await render(
    ChatEnabledEmail({
      recipientName: therapistName,
      therapistName,
      employerName,
      vacancyTitle,
      chatUrl: `${SITE}/terapeuta/mensajes`,
      isTherapist: true,
    }),
  )

  const employerHtml = await render(
    ChatEnabledEmail({
      recipientName: employerName,
      therapistName,
      employerName,
      vacancyTitle,
      chatUrl: `${SITE}/empleador/mensajes`,
      isTherapist: false,
    }),
  )

  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: therapistEmail,
      subject: `${employerName} quiere contactarte — Litsea Empleos`,
      html: therapistHtml,
    }),
    resend.emails.send({
      from: FROM,
      to: employerEmail,
      subject: `Chat habilitado con ${therapistName} — Litsea Empleos`,
      html: employerHtml,
    }),
  ])
}

export async function sendApplicationStatusEmail({
  therapistEmail,
  therapistName,
  employerName,
  vacancyTitle,
  status,
}: {
  therapistEmail: string
  therapistName: string
  employerName: string
  vacancyTitle: string
  status: Extract<ApplicationStatus, 'hired' | 'rejected'>
}) {
  const html = await render(
    ApplicationStatusEmail({
      therapistName,
      employerName,
      vacancyTitle,
      status,
      vacantesUrl: `${SITE}/terapeuta/aplicaciones`,
    }),
  )

  const subject = status === 'hired'
    ? `¡Felicidades! Fuiste seleccionado en ${employerName}`
    : `Actualización de tu aplicación en ${employerName}`

  await resend.emails.send({ from: FROM, to: therapistEmail, subject, html })
}
