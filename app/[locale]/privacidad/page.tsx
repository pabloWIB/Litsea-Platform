import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad — Litsea Empleos',
  description:
    'Aviso de privacidad de Litsea Bolsa de Trabajo. Conoce cómo tratamos y protegemos tus datos personales de acuerdo con la LFPDPPP.',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#071210] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">
              Legal
            </p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-[0.95] mb-4">
              Aviso de<br />
              <span className="text-[#2FB7A3]">privacidad.</span>
            </h1>
            <p className="text-sm text-white/40">
              Litsea Centro de Capacitación · Última actualización: enero 2025
            </p>
          </div>

          {/* Intro */}
          <div className="prose-litsea">
            <p>
              Con fundamento en lo establecido por la Ley Federal de Protección de Datos Personales en
              Posesión de los Particulares, su Reglamento y demás disposiciones aplicables, le informamos
              nuestra Política de Privacidad y Manejo de Datos Personales correspondiente a la plataforma
              <strong> Litsea Bolsa de Trabajo</strong>.
            </p>

            <Section title="Responsable de sus datos">
              <p>
                <strong>Litsea Centro de Capacitación, Salute per Acqua Riviera Maya</strong>, con domicilio en
                Avenida Luis Donaldo Colosio, Lote 15 Manzana 38, Bosque Real, Playa del Carmen, Quintana Roo,
                C.P. 77714, es el responsable del uso y protección de sus datos personales dentro de la
                plataforma <em>empleos.litseacc.edu.mx</em>.
              </p>
            </Section>

            <Section title="Datos personales que recabamos">
              <p>
                Para la operación de la plataforma recopilamos los siguientes datos, según el tipo de usuario:
              </p>
              <p><strong>Terapeutas:</strong> nombre completo, correo electrónico, teléfono, fotografía de
              perfil, especialidades terapéuticas, zonas de trabajo, biografía profesional, años de experiencia
              y documentos de certificación emitidos por Litsea Centro de Capacitación.</p>
              <p><strong>Empleadores:</strong> nombre del establecimiento, nombre del representante, correo
              electrónico, teléfono, sitio web, logotipo y descripción del negocio.</p>
              <p><strong>Todos los usuarios:</strong> dirección IP, tipo de dispositivo y datos de navegación
              necesarios para el correcto funcionamiento de la plataforma.</p>
            </Section>

            <Section title="Uso de sus datos personales">
              <p>Los datos que le solicitamos serán utilizados exclusivamente para:</p>
              <ul>
                <li>Crear y gestionar su cuenta en la plataforma Litsea Bolsa de Trabajo.</li>
                <li>Publicar y gestionar perfiles de terapeutas verificados.</li>
                <li>Publicar y gestionar vacantes laborales de empleadores.</li>
                <li>Facilitar el proceso de aplicación a vacantes.</li>
                <li>Verificar la autenticidad de certificados emitidos por Litsea.</li>
                <li>Habilitar la comunicación entre terapeutas y empleadores cuando así lo autorice el equipo Litsea.</li>
                <li>Enviar notificaciones relacionadas con el estado de su cuenta o aplicaciones.</li>
                <li>Mejorar la experiencia de uso de la plataforma.</li>
              </ul>
              <p>
                Los datos que ingrese en la plataforma <strong>no serán difundidos, distribuidos ni
                comercializados</strong> con terceros fuera del proceso de conexión laboral descrito.
              </p>
            </Section>

            <Section title="Confidencialidad">
              <p>
                Toda la información proporcionada por usted será tratada como <strong>CONFIDENCIAL</strong>,
                con la única excepción legal para el caso de mandamiento judicial en forma por autoridad
                competente, y de las personas que usted mismo disponga para oír y recibir notificaciones.
              </p>
            </Section>

            <Section title="Derechos ARCO">
              <p>
                Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos
                y las condiciones del uso que les damos (<strong>Acceso</strong>). Asimismo, es su derecho
                solicitar la corrección de su información personal en caso de que esté desactualizada, sea
                inexacta o incompleta (<strong>Rectificación</strong>); que la eliminemos de nuestros registros
                o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente
                (<strong>Cancelación</strong>); así como oponerse al uso de sus datos personales para fines
                específicos (<strong>Oposición</strong>).
              </p>
              <p>
                Para ejercer sus derechos ARCO puede contactarnos a través del correo
                <strong> informes@litseacc.edu.mx</strong> o presentarse personalmente con identificación
                oficial vigente en nuestra dirección física.
              </p>
            </Section>

            <Section title="Revocación del consentimiento">
              <p>
                En caso de que desee ser removido de nuestra base de datos, podrá en cualquier momento
                solicitar la baja de su cuenta y sus datos mediante correo electrónico a
                <strong> informes@litseacc.edu.mx</strong> o por escrito dirigido a nuestra dirección física.
              </p>
            </Section>

            <Section title="Transferencia de datos">
              <p>
                Sus datos personales podrán ser compartidos únicamente con los empleadores o terapeutas
                involucrados en un proceso de contacto que haya sido habilitado por el equipo de Litsea,
                siempre dentro del contexto de la plataforma. No realizamos transferencias a terceros ajenos
                a dicho proceso sin su consentimiento previo.
              </p>
            </Section>

            <Section title="Limitación de uso y divulgación">
              <p>
                Puede limitar el uso y divulgación de su información personal a través de su inscripción en
                el Registro Público para Evitar Publicidad (REPEP), a cargo de la Procuraduría Federal del
                Consumidor (PROFECO), con la finalidad de que sus datos no sean utilizados para recibir
                publicidad o promociones.
              </p>
            </Section>

            <Section title="Uso de tecnologías de rastreo">
              <p>
                Le informamos que en nuestra plataforma utilizamos cookies y tecnologías similares para
                monitorear su comportamiento como usuario, garantizar la seguridad de la sesión y brindarle
                una mejor experiencia de navegación. Puede configurar su navegador para rechazar cookies,
                aunque esto podría afectar el funcionamiento de algunas funciones de la plataforma.
              </p>
            </Section>

            <Section title="Seguridad de sus datos">
              <p>
                Implementamos medidas técnicas y organizativas para proteger su información personal,
                incluyendo cifrado de datos, acceso restringido por roles y almacenamiento seguro de
                archivos. Los certificados y documentos subidos a la plataforma se almacenan en servidores
                seguros con acceso controlado.
              </p>
            </Section>

            <Section title="Enlaces a sitios de terceros">
              <p>
                Los usuarios deben saber que al acceder a esta plataforma pueden ser dirigidos a sitios que
                están fuera de nuestro control. Litsea Centro de Capacitación no endosa, representa ni
                garantiza la Política de Privacidad o el contenido de ningún sitio propiedad de terceros que
                tenga enlaces con nuestra plataforma.
              </p>
            </Section>

            <Section title="Cambios al aviso de privacidad">
              <p>
                El presente Aviso de Privacidad puede sufrir modificaciones derivadas de nuevos requerimientos
                legales, de nuestras propias necesidades o de cambios en nuestro modelo de operación. Nos
                comprometemos a mantenerle informado sobre los cambios a través de la plataforma o por
                correspondencia electrónica.
              </p>
            </Section>

            <Section title="Uso indebido">
              <p>
                El uso indebido de nuestra plataforma de comunicación electrónica será denunciado en términos
                de la legislación aplicable vigente.
              </p>
            </Section>
          </div>

          {/* Contact card */}
          <div className="mt-16 p-px bg-white/8 rounded-2xl">
            <div className="bg-[#071210] rounded-2xl p-8">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-5">
                ¿Necesita más información?
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <ContactItem icon={<Mail className="size-4" />} label="informes@litseacc.edu.mx" href="mailto:informes@litseacc.edu.mx" />
                <ContactItem icon={<Phone className="size-4" />} label="+52 (984) 118 5592" href="tel:+529841185592" />
                <ContactItem
                  icon={<MapPin className="size-4" />}
                  label="Av. Luis Donaldo Colosio, Lote 15 Manzana 38, Bosque Real, Playa del Carmen, Q. Roo, C.P. 77714"
                />
                <ContactItem icon={<Globe className="size-4" />} label="litseacc.edu.mx" href="https://litseacc.edu.mx" external />
              </div>
              <p className="text-[11px] text-white/25 mt-6 leading-relaxed">
                La ausencia de respuesta a su comunicado, en ningún caso podrá constituir una negativa o
                afirmativa ficta, según corresponda.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="text-base font-bold text-white mb-3">{title}</h2>
      <div className="text-sm text-white/50 leading-relaxed space-y-3 [&_strong]:text-white/75 [&_em]:text-white/60 [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_li]:pl-4 [&_li]:relative [&_li]:before:content-['—'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-[#2FB7A3]/60">
        {children}
      </div>
    </div>
  )
}

function ContactItem({
  icon,
  label,
  href,
  external,
}: {
  icon: React.ReactNode
  label: string
  href?: string
  external?: boolean
}) {
  const cls = 'flex items-start gap-2.5 text-[13px] text-white/45 hover:text-[#2FB7A3] transition-colors'
  const inner = (
    <>
      <span className="mt-0.5 text-[#2FB7A3]/70 shrink-0">{icon}</span>
      <span>{label}</span>
    </>
  )
  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={cls}>
        {inner}
      </a>
    )
  }
  return <div className={`${cls} cursor-default hover:text-white/45`}>{inner}</div>
}
