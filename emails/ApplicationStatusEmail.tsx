import {
  Html, Head, Body, Container, Section,
  Heading, Text, Button, Hr, Preview,
} from '@react-email/components'
import type { ApplicationStatus } from '@/types/database'

interface Props {
  therapistName: string
  employerName: string
  vacancyTitle: string
  status: Extract<ApplicationStatus, 'hired' | 'rejected'>
  vacantesUrl: string
}

const STATUS_CONFIG = {
  hired: {
    preview: '¡Felicidades! Fuiste seleccionado',
    headline: '¡Felicidades!',
    body: (employer: string, vacancy: string) =>
      `${employer} ha decidido contratarte para la vacante de <strong>${vacancy}</strong>. El equipo de RRHH se pondrá en contacto contigo pronto con los detalles.`,
    ctaLabel: 'Ver mis aplicaciones',
    accentColor: '#2FB7A3',
  },
  rejected: {
    preview: 'Actualización sobre tu aplicación',
    headline: 'Actualización de tu aplicación',
    body: (employer: string, vacancy: string) =>
      `Lamentablemente, <strong>${employer}</strong> ha decidido no continuar con tu candidatura para la vacante de <strong>${vacancy}</strong>. ¡No te desanimes, hay muchas más oportunidades!`,
    ctaLabel: 'Explorar más vacantes',
    accentColor: '#8a8a8a',
  },
}

export default function ApplicationStatusEmail({
  therapistName,
  employerName,
  vacancyTitle,
  status,
  vacantesUrl,
}: Props) {
  const cfg = STATUS_CONFIG[status]

  return (
    <Html lang="es">
      <Head />
      <Preview>{cfg.preview}</Preview>
      <Body style={{ backgroundColor: '#FDFAF5', fontFamily: 'Geist, system-ui, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: 520, margin: '40px auto', padding: '0 16px' }}>

          {/* Header */}
          <Section style={{ backgroundColor: '#071210', borderRadius: '16px 16px 0 0', padding: '32px 40px 24px' }}>
            <Text style={{ color: '#2FB7A3', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Litsea Empleos
            </Text>
            <Heading style={{ color: '#ffffff', fontSize: 24, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
              {cfg.headline}
            </Heading>
          </Section>

          {/* Body */}
          <Section style={{ backgroundColor: '#ffffff', padding: '32px 40px', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>
            <Text style={{ fontSize: 15, color: '#4a4a4a', margin: '0 0 16px' }}>
              Hola <strong>{therapistName}</strong>,
            </Text>
            <Text style={{ fontSize: 15, color: '#4a4a4a', margin: '0 0 28px', lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: cfg.body(employerName, vacancyTitle) }}
            />

            <Button href={vacantesUrl}
              style={{
                backgroundColor: cfg.accentColor,
                borderRadius: 100,
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                padding: '12px 28px',
                textDecoration: 'none',
                display: 'inline-block',
              }}>
              {cfg.ctaLabel} →
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#f9fafb', borderRadius: '0 0 16px 16px', padding: '20px 40px', border: '1px solid #e5e7eb', borderTop: 'none' }}>
            <Hr style={{ borderColor: '#e5e7eb', margin: '0 0 16px' }} />
            <Text style={{ fontSize: 11, color: '#8a8a8a', margin: 0, textAlign: 'center' }}>
              Litsea Centro de Capacitación · Riviera Maya, Q.R., México
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

ApplicationStatusEmail.PreviewProps = {
  therapistName: 'María García',
  employerName: 'Grand Hyatt Playa del Carmen',
  vacancyTitle: 'Terapeuta de Masajes Sueco',
  status: 'hired',
  vacantesUrl: 'https://empleos.litseacc.edu.mx/terapeuta/aplicaciones',
} satisfies Props
