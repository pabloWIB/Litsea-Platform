import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Litsea Empleos',
  description:
    'Términos y condiciones de uso de la plataforma Litsea Bolsa de Trabajo. Conoce tus derechos y obligaciones como usuario.',
}

export default function TerminosPage() {
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
              Términos y<br />
              <span className="text-[#2FB7A3]">condiciones.</span>
            </h1>
            <p className="text-sm text-white/40">
              Litsea Centro de Capacitación · Última actualización: enero 2025
            </p>
          </div>

          {/* Intro */}
          <div className="text-sm text-white/50 leading-relaxed mb-10">
            <p>
              Al registrarte en <strong className="text-white/75">Litsea Bolsa de Trabajo</strong> o utilizar
              cualquiera de sus funciones, aceptas estar sujeto a los siguientes Términos y Condiciones.
              Te pedimos que los leas detenidamente antes de continuar.
            </p>
          </div>

          <div className="prose-litsea">

            <Section number="1" title="Información general">
              <p>
                <strong>Litsea Centro de Capacitación, Salute per Acqua Riviera Maya</strong>, con domicilio en
                Avenida Luis Donaldo Colosio, Lote 15 Manzana 38, Bosque Real, Playa del Carmen, Quintana Roo,
                C.P. 77714, es el titular y responsable de la plataforma <em>Litsea Bolsa de Trabajo</em>,
                disponible en <em>empleos.litseacc.edu.mx</em>.
              </p>
            </Section>

            <Section number="2" title="Descripción del servicio">
              <p>
                Litsea Bolsa de Trabajo es una plataforma digital que conecta a terapeutas egresados de
                Litsea Centro de Capacitación con hoteles, spas y centros de bienestar de alto nivel en la
                Riviera Maya. Los servicios que ofrece incluyen:
              </p>
              <ul>
                <li>Creación y publicación de perfiles profesionales para terapeutas.</li>
                <li>Publicación de vacantes laborales para empleadores verificados.</li>
                <li>Gestión de aplicaciones a vacantes.</li>
                <li>Verificación de certificados emitidos por Litsea.</li>
                <li>Comunicación directa entre terapeutas y empleadores, previa habilitación por el equipo Litsea.</li>
              </ul>
              <p>
                Nos reservamos el derecho de modificar, suspender o descontinuar cualquier funcionalidad de
                la plataforma en cualquier momento, notificando a los usuarios registrados con la debida anticipación.
              </p>
            </Section>

            <Section number="3" title="Registro y cuentas de usuario">
              <p>
                Para acceder a las funciones de la plataforma deberás crear una cuenta. Según tu perfil:
              </p>
              <p>
                <strong>Terapeutas:</strong> completar el formulario de registro con datos verídicos,
                subir al menos un certificado válido emitido por Litsea Centro de Capacitación y aceptar
                estos Términos. La cuenta quedará activa una vez que el equipo Litsea verifique tu perfil.
              </p>
              <p>
                <strong>Empleadores:</strong> completar el formulario de registro con los datos del
                establecimiento y aceptar estos Términos. La cuenta quedará en estado <em>pendiente</em>
                hasta que el equipo Litsea apruebe el registro. Un empleador no podrá publicar vacantes
                hasta obtener dicha aprobación.
              </p>
              <p>
                Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades
                que ocurran bajo tu cuenta.
              </p>
            </Section>

            <Section number="4" title="Reglas de uso de la plataforma">
              <ul>
                <li>Solo pueden registrarse como terapeutas los egresados de Litsea Centro de Capacitación con al menos un certificado vigente emitido por la institución.</li>
                <li>Un empleador no puede publicar vacantes hasta ser aprobado por el equipo Litsea.</li>
                <li>Un empleador aprobado puede publicar vacantes ilimitadas.</li>
                <li>Un terapeuta puede aplicar a varias vacantes del mismo empleador.</li>
                <li>La habilitación del chat entre un terapeuta y un empleador requiere siempre la aprobación del equipo Litsea. No existe contacto directo sin dicha autorización.</li>
                <li>Queda prohibido publicar información falsa, engañosa o que no corresponda a la realidad del perfil o la vacante.</li>
                <li>Queda prohibido el uso de la plataforma para fines distintos al proceso de búsqueda y oferta de empleo en el sector de bienestar y spa.</li>
              </ul>
            </Section>

            <Section number="5" title="Contenido del usuario">
              <p>
                Eres el único responsable del contenido que publicas en la plataforma, incluyendo datos de
                perfil, fotografías, certificados y vacantes. Al publicar contenido, garantizas que:
              </p>
              <ul>
                <li>La información es veraz, actualizada y no infringe derechos de terceros.</li>
                <li>Cuentas con los permisos necesarios para publicar las imágenes y documentos subidos.</li>
                <li>El contenido no es ofensivo, discriminatorio ni viola la legislación mexicana vigente.</li>
              </ul>
              <p>
                Litsea Centro de Capacitación se reserva el derecho de retirar cualquier contenido que
                incumpla estas condiciones sin previo aviso.
              </p>
            </Section>

            <Section number="6" title="Suspensión y cancelación de cuentas">
              <p>
                El equipo Litsea puede suspender o cancelar cualquier cuenta que incumpla estos Términos,
                publique información falsa, tenga un comportamiento inapropiado o perjudique la integridad
                de la plataforma. Las solicitudes de baja voluntaria pueden realizarse a través de
                <strong> informes@litseacc.edu.mx</strong>.
              </p>
            </Section>

            <Section number="7" title="Gratuidad del servicio">
              <p>
                El acceso a la plataforma Litsea Bolsa de Trabajo es completamente <strong>gratuito para
                los terapeutas</strong> egresados de Litsea Centro de Capacitación. La plataforma no
                cobra comisiones sobre contrataciones ni cobra por la publicación de perfiles.
              </p>
              <p>
                Litsea Centro de Capacitación se reserva el derecho de establecer condiciones económicas
                para empleadores en versiones futuras de la plataforma, notificando con anticipación a los
                usuarios registrados.
              </p>
            </Section>

            <Section number="8" title="Propiedad intelectual">
              <p>
                Todo el contenido de esta plataforma, incluyendo textos, diseños, logotipos, código fuente e
                imágenes institucionales, es propiedad de Litsea Centro de Capacitación o de sus respectivos
                titulares, y está protegido por las leyes de propiedad intelectual vigentes en México. Queda
                prohibida su reproducción, distribución o uso sin autorización expresa y por escrito.
              </p>
            </Section>

            <Section number="9" title="Limitación de responsabilidad">
              <p>
                Litsea Centro de Capacitación actúa como intermediario entre terapeutas y empleadores. No
                somos responsables de:
              </p>
              <ul>
                <li>Las decisiones de contratación que tomen los empleadores.</li>
                <li>El incumplimiento de acuerdos laborales entre las partes.</li>
                <li>La veracidad de la información publicada por los usuarios fuera de lo que podemos verificar directamente.</li>
                <li>Interrupciones del servicio por causas técnicas ajenas a nuestra voluntad.</li>
              </ul>
            </Section>

            <Section number="10" title="Privacidad">
              <p>
                El tratamiento de tus datos personales se rige por nuestro{' '}
                <a href="/privacidad" className="text-[#2FB7A3] hover:underline">
                  Aviso de Privacidad
                </a>
                , el cual forma parte integral de estos Términos y Condiciones.
              </p>
            </Section>

            <Section number="11" title="Modificaciones">
              <p>
                Litsea Centro de Capacitación se reserva el derecho de modificar estos Términos en cualquier
                momento. Las modificaciones entrarán en vigor a partir de su publicación en la plataforma.
                El uso continuado del servicio tras la publicación de cambios constituye la aceptación de
                los nuevos términos.
              </p>
            </Section>

            <Section number="12" title="Legislación aplicable">
              <p>
                Los presentes Términos y Condiciones se rigen por las leyes vigentes de los Estados Unidos
                Mexicanos. Para cualquier controversia derivada de su interpretación o aplicación, las partes
                se someten a la jurisdicción de los tribunales competentes de Playa del Carmen, Quintana Roo,
                renunciando expresamente a cualquier otro fuero que pudiera corresponderles.
              </p>
            </Section>

          </div>

          {/* Closing note */}
          <div className="mt-10 p-5 bg-white/4 border border-white/8 rounded-xl">
            <p className="text-[13px] text-white/40 leading-relaxed">
              Al registrarte en Litsea Bolsa de Trabajo o utilizar sus funciones, confirmas haber leído,
              comprendido y aceptado estos Términos y Condiciones en su totalidad.
            </p>
          </div>

          {/* Contact card */}
          <div className="mt-12 p-px bg-white/8 rounded-2xl">
            <div className="bg-[#071210] rounded-2xl p-8">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-5">
                ¿Tienes alguna pregunta?
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <ContactItem icon={<Mail className="size-4" />} label="informes@litseacc.edu.mx" href="mailto:informes@litseacc.edu.mx" />
                <ContactItem icon={<Phone className="size-4" />} label="+52 984 233 7294" href="tel:+529842337294" />
                <ContactItem
                  icon={<MapPin className="size-4" />}
                  label="Av. Luis Donaldo Colosio, Lote 15 Manzana 38, Bosque Real, Playa del Carmen, Q. Roo, C.P. 77714"
                />
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

function Section({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="text-base font-bold text-white mb-3">
        <span className="text-[#2FB7A3] mr-2">{number}.</span>
        {title}
      </h2>
      <div className="text-sm text-white/50 leading-relaxed space-y-3 [&_strong]:text-white/75 [&_em]:text-white/60 [&_a]:text-[#2FB7A3] [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_li]:pl-4 [&_li]:relative [&_li]:before:content-['—'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-[#2FB7A3]/60">
        {children}
      </div>
    </div>
  )
}

function ContactItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href?: string
}) {
  const cls = 'flex items-start gap-2.5 text-[13px] text-white/45 hover:text-[#2FB7A3] transition-colors'
  const inner = (
    <>
      <span className="mt-0.5 text-[#2FB7A3]/70 shrink-0">{icon}</span>
      <span>{label}</span>
    </>
  )
  if (href) {
    return <a href={href} className={cls}>{inner}</a>
  }
  return <div className={`${cls} cursor-default hover:text-white/45`}>{inner}</div>
}
