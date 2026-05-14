import {
  Html, Head, Body, Container, Section,
  Heading, Text, Button, Hr, Preview,
} from '@react-email/components'

interface Props {
  recipientName: string
  therapistName: string
  employerName: string
  vacancyTitle: string
  chatUrl: string
  isTherapist: boolean
}

export default function ChatEnabledEmail({
  recipientName,
  therapistName,
  employerName,
  vacancyTitle,
  chatUrl,
  isTherapist,
}: Props) {
  const subject = isTherapist
    ? `${employerName} quiere contactarte`
    : `${therapistName} está disponible para chatear`

  return (
    <Html lang="es">
      <Head />
      <Preview>{subject}</Preview>
      <Body style={{ backgroundColor: '#FDFAF5', fontFamily: 'Geist, system-ui, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: 520, margin: '40px auto', padding: '0 16px' }}>

          {/* Header */}
          <Section style={{ backgroundColor: '#071210', borderRadius: '16px 16px 0 0', padding: '32px 40px 24px' }}>
            <Text style={{ color: '#2FB7A3', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Litsea Empleos
            </Text>
            <Heading style={{ color: '#ffffff', fontSize: 24, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
              {isTherapist ? '¡Chat habilitado!' : 'Chat habilitado con el candidato'}
            </Heading>
          </Section>

          {/* Body */}
          <Section style={{ backgroundColor: '#ffffff', padding: '32px 40px', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>
            <Text style={{ fontSize: 15, color: '#4a4a4a', margin: '0 0 16px' }}>
              Hola <strong>{recipientName}</strong>,
            </Text>
            <Text style={{ fontSize: 15, color: '#4a4a4a', margin: '0 0 16px', lineHeight: 1.6 }}>
              {isTherapist
                ? `El equipo Litsea ha habilitado el chat entre tú y <strong>${employerName}</strong> para la vacante de <strong>${vacancyTitle}</strong>.`
                : `El equipo Litsea ha habilitado el chat con <strong>${therapistName}</strong> para la vacante de <strong>${vacancyTitle}</strong>.`
              }
            </Text>
            <Text style={{ fontSize: 14, color: '#8a8a8a', margin: '0 0 28px', lineHeight: 1.6 }}>
              Ya pueden comunicarse directamente. Responde con profesionalismo y cordialidad.
            </Text>

            <Button href={chatUrl}
              style={{
                backgroundColor: '#2FB7A3',
                borderRadius: 100,
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                padding: '12px 28px',
                textDecoration: 'none',
                display: 'inline-block',
              }}>
              Ir al chat →
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

ChatEnabledEmail.PreviewProps = {
  recipientName: 'María García',
  therapistName: 'María García',
  employerName: 'Grand Hyatt Playa del Carmen',
  vacancyTitle: 'Terapeuta de Masajes Sueco',
  chatUrl: 'https://empleos.litseacc.edu.mx/terapeuta/mensajes',
  isTherapist: true,
} satisfies Props
