import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Mail, Phone, MapPin } from 'lucide-react'
import LegalShell from '@/components/legales/LegalShell'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pageTitles' })
  return {
    title: t('terminos'),
    description: 'Términos y condiciones de uso de la plataforma Litsea Bolsa de Trabajo.',
  }
}

type SectionData = { number: string; title: string; content: React.ReactNode }
type PageContent = { intro: React.ReactNode; sections: SectionData[]; closingNote: string }

function getContent(locale: string): PageContent {
  if (locale === 'en') return {
    intro: <p>By registering on <strong>Litsea Job Board</strong> or using any of its features, you agree to be bound by the following Terms and Conditions. Please read them carefully before continuing.</p>,
    closingNote: 'By registering on Litsea Job Board or using its features, you confirm that you have read, understood and accepted these Terms and Conditions in their entirety.',
    sections: [
      { number: '1', title: 'General information', content: <p><strong>Litsea Centro de Capacitación, Salute per Acqua Riviera Maya</strong>, with address at Avenida Luis Donaldo Colosio, Lot 15, Block 38, Bosque Real, Playa del Carmen, Quintana Roo, ZIP 77714, is the owner and operator of the <em>Litsea Job Board</em> platform, available at <em>empleos.litseacc.edu.mx</em>.</p> },
      { number: '2', title: 'Description of the service', content: <>
        <p>Litsea Job Board is a digital platform connecting therapists who have graduated from Litsea Centro de Capacitación with high-end hotels, spas and wellness centers in the Riviera Maya. Services include:</p>
        <ul>
          <li>Creation and publication of professional profiles for therapists.</li>
          <li>Job vacancy publication for verified employers.</li>
          <li>Job application management.</li>
          <li>Verification of certificates issued by Litsea.</li>
          <li>Direct communication between therapists and employers, subject to Litsea team authorization.</li>
        </ul>
        <p>We reserve the right to modify, suspend or discontinue any platform feature at any time, with prior notice to registered users.</p>
      </> },
      { number: '3', title: 'Registration and user accounts', content: <>
        <p>To access platform features you must create an account. Depending on your profile:</p>
        <p><strong>Therapists:</strong> complete the registration form with truthful data, upload at least one valid certificate issued by Litsea Centro de Capacitación and accept these Terms. The account will be activated once the Litsea team verifies your profile.</p>
        <p><strong>Employers:</strong> complete the registration form with the establishment's details and accept these Terms. The account will remain <em>pending</em> until the Litsea team approves the registration.</p>
        <p>You are responsible for maintaining the confidentiality of your password and all activities that occur under your account.</p>
      </> },
      { number: '4', title: 'Platform usage rules', content: <ul>
        <li>Only graduates of Litsea Centro de Capacitación with at least one valid certificate issued by the institution may register as therapists.</li>
        <li>An employer may not publish vacancies until approved by the Litsea team.</li>
        <li>An approved employer may publish unlimited vacancies.</li>
        <li>A therapist may apply to multiple vacancies from the same employer.</li>
        <li>Chat activation between a therapist and an employer always requires Litsea team approval. No direct contact exists without such authorization.</li>
        <li>Publishing false, misleading or inaccurate information about profiles or vacancies is prohibited.</li>
        <li>Using the platform for purposes other than employment search and offering in the wellness and spa sector is prohibited.</li>
      </ul> },
      { number: '5', title: 'User content', content: <>
        <p>You are solely responsible for the content you publish on the platform, including profile data, photos, certificates and vacancies. By publishing content, you guarantee that:</p>
        <ul>
          <li>The information is truthful, up-to-date and does not infringe third-party rights.</li>
          <li>You have the necessary permissions to publish the images and documents uploaded.</li>
          <li>The content is not offensive, discriminatory or in violation of Mexican legislation.</li>
        </ul>
        <p>Litsea Centro de Capacitación reserves the right to remove any content that fails to comply with these conditions without prior notice.</p>
      </> },
      { number: '6', title: 'Account suspension and cancellation', content: <p>The Litsea team may suspend or cancel any account that violates these Terms, publishes false information, behaves inappropriately or harms the integrity of the platform. Voluntary cancellation requests can be made via <strong>informes@litseacc.edu.mx</strong>.</p> },
      { number: '7', title: 'Free service', content: <>
        <p>Access to the Litsea Job Board platform is completely <strong>free for therapists</strong> who have graduated from Litsea Centro de Capacitación. The platform does not charge commissions on hires or fees for profile publication.</p>
        <p>Litsea Centro de Capacitación reserves the right to establish fees for employers in future versions of the platform, with advance notice to registered users.</p>
      </> },
      { number: '8', title: 'Intellectual property', content: <p>All content on this platform, including texts, designs, logos, source code and institutional images, is the property of Litsea Centro de Capacitación or its respective rights holders and is protected by intellectual property laws in force in Mexico. Reproduction, distribution or use without express written authorization is prohibited.</p> },
      { number: '9', title: 'Limitation of liability', content: <>
        <p>Litsea Centro de Capacitación acts as an intermediary between therapists and employers. We are not responsible for:</p>
        <ul>
          <li>Hiring decisions made by employers.</li>
          <li>Non-fulfillment of employment agreements between parties.</li>
          <li>The accuracy of information published by users beyond what we can directly verify.</li>
          <li>Service interruptions due to technical causes beyond our control.</li>
        </ul>
      </> },
      { number: '10', title: 'Privacy', content: <p>The processing of your personal data is governed by our <a href="/privacidad" className="text-[#2FB7A3] hover:underline">Privacy Notice</a>, which forms an integral part of these Terms and Conditions.</p> },
      { number: '11', title: 'Modifications', content: <p>Litsea Centro de Capacitación reserves the right to modify these Terms at any time. Modifications will take effect upon publication on the platform. Continued use of the service after the publication of changes constitutes acceptance of the new terms.</p> },
      { number: '12', title: 'Applicable law', content: <p>These Terms and Conditions are governed by the laws in force in the United Mexican States. For any dispute arising from their interpretation or application, the parties submit to the jurisdiction of the competent courts of Playa del Carmen, Quintana Roo, expressly waiving any other jurisdiction that may apply.</p> },
    ]
  }

  if (locale === 'fr') return {
    intro: <p>En vous inscrivant sur <strong>Litsea Bolsa de Trabajo</strong> ou en utilisant l'une de ses fonctionnalités, vous acceptez d'être soumis aux présentes Conditions générales d'utilisation. Nous vous invitons à les lire attentivement avant de continuer.</p>,
    closingNote: 'En vous inscrivant sur Litsea Bolsa de Trabajo ou en utilisant ses fonctionnalités, vous confirmez avoir lu, compris et accepté ces Conditions générales dans leur intégralité.',
    sections: [
      { number: '1', title: 'Informations générales', content: <p><strong>Litsea Centro de Capacitación, Salute per Acqua Riviera Maya</strong>, dont le siège est à l'Avenida Luis Donaldo Colosio, Lot 15, Manzana 38, Bosque Real, Playa del Carmen, Quintana Roo, C.P. 77714, est le titulaire et responsable de la plateforme <em>Litsea Bolsa de Trabajo</em>, disponible à l'adresse <em>empleos.litseacc.edu.mx</em>.</p> },
      { number: '2', title: 'Description du service', content: <>
        <p>Litsea Bolsa de Trabajo est une plateforme numérique qui met en relation des thérapeutes diplômés de Litsea Centro de Capacitación avec des hôtels, spas et centres de bien-être haut de gamme de la Riviera Maya. Les services comprennent :</p>
        <ul>
          <li>Création et publication de profils professionnels pour les thérapeutes.</li>
          <li>Publication d'offres d'emploi pour les employeurs vérifiés.</li>
          <li>Gestion des candidatures aux offres d'emploi.</li>
          <li>Vérification des certificats émis par Litsea.</li>
          <li>Communication directe entre thérapeutes et employeurs, sous réserve d'autorisation de l'équipe Litsea.</li>
        </ul>
        <p>Nous nous réservons le droit de modifier, suspendre ou interrompre toute fonctionnalité de la plateforme à tout moment, en avertissant les utilisateurs inscrits à l'avance.</p>
      </> },
      { number: '3', title: 'Inscription et comptes utilisateurs', content: <>
        <p>Pour accéder aux fonctionnalités de la plateforme, vous devez créer un compte. Selon votre profil :</p>
        <p><strong>Thérapeutes :</strong> remplir le formulaire d'inscription avec des données véridiques, télécharger au moins un certificat valide émis par Litsea Centro de Capacitación et accepter ces Conditions. Le compte sera activé une fois que l'équipe Litsea aura vérifié votre profil.</p>
        <p><strong>Employeurs :</strong> remplir le formulaire d'inscription avec les données de l'établissement et accepter ces Conditions. Le compte restera en état <em>en attente</em> jusqu'à l'approbation de l'équipe Litsea.</p>
        <p>Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités effectuées sous votre compte.</p>
      </> },
      { number: '4', title: "Règles d'utilisation de la plateforme", content: <ul>
        <li>Seuls les diplômés de Litsea Centro de Capacitación titulaires d'au moins un certificat valide peuvent s'inscrire en tant que thérapeutes.</li>
        <li>Un employeur ne peut pas publier d'offres avant d'être approuvé par l'équipe Litsea.</li>
        <li>Un employeur approuvé peut publier un nombre illimité d'offres.</li>
        <li>Un thérapeute peut postuler à plusieurs offres du même employeur.</li>
        <li>L'activation du chat entre un thérapeute et un employeur nécessite toujours l'approbation de l'équipe Litsea.</li>
        <li>La publication d'informations fausses, trompeuses ou inexactes est interdite.</li>
        <li>L'utilisation de la plateforme à des fins autres que la recherche et l'offre d'emploi dans le secteur bien-être est interdite.</li>
      </ul> },
      { number: '5', title: 'Contenu utilisateur', content: <>
        <p>Vous êtes seul responsable du contenu que vous publiez sur la plateforme. En publiant du contenu, vous garantissez que :</p>
        <ul>
          <li>Les informations sont véridiques, à jour et ne portent pas atteinte aux droits de tiers.</li>
          <li>Vous disposez des autorisations nécessaires pour publier les images et documents téléchargés.</li>
          <li>Le contenu n'est pas offensant, discriminatoire ni contraire à la législation mexicaine.</li>
        </ul>
        <p>Litsea Centro de Capacitación se réserve le droit de retirer tout contenu non conforme sans préavis.</p>
      </> },
      { number: '6', title: 'Suspension et résiliation de comptes', content: <p>L'équipe Litsea peut suspendre ou résilier tout compte qui enfreint ces Conditions, publie de fausses informations ou nuit à l'intégrité de la plateforme. Les demandes de résiliation volontaire peuvent être adressées à <strong>informes@litseacc.edu.mx</strong>.</p> },
      { number: '7', title: 'Gratuité du service', content: <>
        <p>L'accès à la plateforme est entièrement <strong>gratuit pour les thérapeutes</strong> diplômés de Litsea Centro de Capacitación. La plateforme ne perçoit pas de commissions sur les embauches ni de frais pour la publication de profils.</p>
        <p>Litsea Centro de Capacitación se réserve le droit d'établir des conditions tarifaires pour les employeurs dans de futures versions de la plateforme, en notifiant les utilisateurs à l'avance.</p>
      </> },
      { number: '8', title: 'Propriété intellectuelle', content: <p>Tout le contenu de cette plateforme, y compris les textes, designs, logos, code source et images institutionnelles, est la propriété de Litsea Centro de Capacitación ou de leurs titulaires respectifs et est protégé par les lois mexicaines sur la propriété intellectuelle. Toute reproduction, distribution ou utilisation sans autorisation écrite expresse est interdite.</p> },
      { number: '9', title: 'Limitation de responsabilité', content: <>
        <p>Litsea Centro de Capacitación agit en tant qu'intermédiaire entre thérapeutes et employeurs. Nous ne sommes pas responsables de :</p>
        <ul>
          <li>Les décisions d'embauche prises par les employeurs.</li>
          <li>Le non-respect des accords de travail entre les parties.</li>
          <li>L'exactitude des informations publiées par les utilisateurs au-delà de ce que nous pouvons vérifier directement.</li>
          <li>Les interruptions de service dues à des causes techniques indépendantes de notre volonté.</li>
        </ul>
      </> },
      { number: '10', title: 'Confidentialité', content: <p>Le traitement de vos données personnelles est régi par notre <a href="/privacidad" className="text-[#2FB7A3] hover:underline">Avis de confidentialité</a>, qui fait partie intégrante des présentes Conditions générales.</p> },
      { number: '11', title: 'Modifications', content: <p>Litsea Centro de Capacitación se réserve le droit de modifier ces Conditions à tout moment. Les modifications prendront effet dès leur publication sur la plateforme. L'utilisation continue du service après publication des modifications vaut acceptation des nouvelles conditions.</p> },
      { number: '12', title: 'Droit applicable', content: <p>Les présentes Conditions générales sont régies par les lois en vigueur aux États-Unis du Mexique. Pour tout litige découlant de leur interprétation ou application, les parties se soumettent à la juridiction des tribunaux compétents de Playa del Carmen, Quintana Roo, renonçant expressément à tout autre for.</p> },
    ]
  }

  return {
    intro: <p>Al registrarte en <strong>Litsea Bolsa de Trabajo</strong> o utilizar cualquiera de sus funciones, aceptas estar sujeto a los siguientes Términos y Condiciones. Te pedimos que los leas detenidamente antes de continuar.</p>,
    closingNote: 'Al registrarte en Litsea Bolsa de Trabajo o utilizar sus funciones, confirmas haber leído, comprendido y aceptado estos Términos y Condiciones en su totalidad.',
    sections: [
      { number: '1', title: 'Información general', content: <p><strong>Litsea Centro de Capacitación, Salute per Acqua Riviera Maya</strong>, con domicilio en Avenida Luis Donaldo Colosio, Lote 15 Manzana 38, Bosque Real, Playa del Carmen, Quintana Roo, C.P. 77714, es el titular y responsable de la plataforma <em>Litsea Bolsa de Trabajo</em>, disponible en <em>empleos.litseacc.edu.mx</em>.</p> },
      { number: '2', title: 'Descripción del servicio', content: <>
        <p>Litsea Bolsa de Trabajo es una plataforma digital que conecta a terapeutas egresados de Litsea Centro de Capacitación con hoteles, spas y centros de bienestar de alto nivel en la Riviera Maya. Los servicios que ofrece incluyen:</p>
        <ul>
          <li>Creación y publicación de perfiles profesionales para terapeutas.</li>
          <li>Publicación de vacantes laborales para empleadores verificados.</li>
          <li>Gestión de aplicaciones a vacantes.</li>
          <li>Verificación de certificados emitidos por Litsea.</li>
          <li>Comunicación directa entre terapeutas y empleadores, previa habilitación por el equipo Litsea.</li>
        </ul>
        <p>Nos reservamos el derecho de modificar, suspender o descontinuar cualquier funcionalidad de la plataforma en cualquier momento, notificando a los usuarios registrados con la debida anticipación.</p>
      </> },
      { number: '3', title: 'Registro y cuentas de usuario', content: <>
        <p>Para acceder a las funciones de la plataforma deberás crear una cuenta. Según tu perfil:</p>
        <p><strong>Terapeutas:</strong> completar el formulario de registro con datos verídicos, subir al menos un certificado válido emitido por Litsea Centro de Capacitación y aceptar estos Términos. La cuenta quedará activa una vez que el equipo Litsea verifique tu perfil.</p>
        <p><strong>Empleadores:</strong> completar el formulario de registro con los datos del establecimiento y aceptar estos Términos. La cuenta quedará en estado <em>pendiente</em> hasta que el equipo Litsea apruebe el registro.</p>
        <p>Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.</p>
      </> },
      { number: '4', title: 'Reglas de uso de la plataforma', content: <ul>
        <li>Solo pueden registrarse como terapeutas los egresados de Litsea Centro de Capacitación con al menos un certificado vigente emitido por la institución.</li>
        <li>Un empleador no puede publicar vacantes hasta ser aprobado por el equipo Litsea.</li>
        <li>Un empleador aprobado puede publicar vacantes ilimitadas.</li>
        <li>Un terapeuta puede aplicar a varias vacantes del mismo empleador.</li>
        <li>La habilitación del chat entre un terapeuta y un empleador requiere siempre la aprobación del equipo Litsea.</li>
        <li>Queda prohibido publicar información falsa, engañosa o que no corresponda a la realidad del perfil o la vacante.</li>
        <li>Queda prohibido el uso de la plataforma para fines distintos al proceso de búsqueda y oferta de empleo en el sector de bienestar y spa.</li>
      </ul> },
      { number: '5', title: 'Contenido del usuario', content: <>
        <p>Eres el único responsable del contenido que publicas en la plataforma. Al publicar contenido, garantizas que:</p>
        <ul>
          <li>La información es veraz, actualizada y no infringe derechos de terceros.</li>
          <li>Cuentas con los permisos necesarios para publicar las imágenes y documentos subidos.</li>
          <li>El contenido no es ofensivo, discriminatorio ni viola la legislación mexicana vigente.</li>
        </ul>
        <p>Litsea Centro de Capacitación se reserva el derecho de retirar cualquier contenido que incumpla estas condiciones sin previo aviso.</p>
      </> },
      { number: '6', title: 'Suspensión y cancelación de cuentas', content: <p>El equipo Litsea puede suspender o cancelar cualquier cuenta que incumpla estos Términos, publique información falsa o perjudique la integridad de la plataforma. Las solicitudes de baja voluntaria pueden realizarse a través de <strong>informes@litseacc.edu.mx</strong>.</p> },
      { number: '7', title: 'Gratuidad del servicio', content: <>
        <p>El acceso a la plataforma Litsea Bolsa de Trabajo es completamente <strong>gratuito para los terapeutas</strong> egresados de Litsea Centro de Capacitación. La plataforma no cobra comisiones sobre contrataciones ni por la publicación de perfiles.</p>
        <p>Litsea Centro de Capacitación se reserva el derecho de establecer condiciones económicas para empleadores en versiones futuras de la plataforma, notificando con anticipación a los usuarios registrados.</p>
      </> },
      { number: '8', title: 'Propiedad intelectual', content: <p>Todo el contenido de esta plataforma, incluyendo textos, diseños, logotipos, código fuente e imágenes institucionales, es propiedad de Litsea Centro de Capacitación o de sus respectivos titulares, y está protegido por las leyes de propiedad intelectual vigentes en México. Queda prohibida su reproducción, distribución o uso sin autorización expresa y por escrito.</p> },
      { number: '9', title: 'Limitación de responsabilidad', content: <>
        <p>Litsea Centro de Capacitación actúa como intermediario entre terapeutas y empleadores. No somos responsables de:</p>
        <ul>
          <li>Las decisiones de contratación que tomen los empleadores.</li>
          <li>El incumplimiento de acuerdos laborales entre las partes.</li>
          <li>La veracidad de la información publicada por los usuarios fuera de lo que podemos verificar directamente.</li>
          <li>Interrupciones del servicio por causas técnicas ajenas a nuestra voluntad.</li>
        </ul>
      </> },
      { number: '10', title: 'Privacidad', content: <p>El tratamiento de tus datos personales se rige por nuestro <a href="/privacidad" className="text-[#2FB7A3] hover:underline">Aviso de Privacidad</a>, el cual forma parte integral de estos Términos y Condiciones.</p> },
      { number: '11', title: 'Modificaciones', content: <p>Litsea Centro de Capacitación se reserva el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigor a partir de su publicación en la plataforma. El uso continuado del servicio tras la publicación de cambios constituye la aceptación de los nuevos términos.</p> },
      { number: '12', title: 'Legislación aplicable', content: <p>Los presentes Términos y Condiciones se rigen por las leyes vigentes de los Estados Unidos Mexicanos. Para cualquier controversia derivada de su interpretación o aplicación, las partes se someten a la jurisdicción de los tribunales competentes de Playa del Carmen, Quintana Roo, renunciando expresamente a cualquier otro fuero que pudiera corresponderles.</p> },
    ]
  }
}

export default async function TerminosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  const content = getContent(locale)

  return (
    <LegalShell>
      <div className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">{t('label')}</p>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#0d1f1c] leading-[0.95] mb-4">
          {locale === 'en' ? <>Terms &amp;<br /><span className="text-[#2FB7A3]">conditions.</span></> :
           locale === 'fr' ? <>Conditions<br /><span className="text-[#2FB7A3]">générales.</span></> :
           <>Términos y<br /><span className="text-[#2FB7A3]">condiciones.</span></>}
        </h1>
        <p className="text-sm text-[#8a8a8a]">{t('lastUpdated')}</p>
      </div>

      <div className="text-sm text-[#5a5a5a] leading-relaxed mb-2">{content.intro}</div>

      <div className="space-y-0">
        {content.sections.map((s) => (
          <Section key={s.number} number={s.number} title={s.title}>{s.content}</Section>
        ))}
      </div>

      <div className="mt-10 p-5 bg-black/4 border border-black/6 rounded-xl">
        <p className="text-[13px] text-[#8a8a8a] leading-relaxed">{content.closingNote}</p>
      </div>

      <div className="mt-12 rounded-2xl border border-black/8 bg-white p-8">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-5">{t('contactQuestion')}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <ContactItem icon={<Mail className="size-4" />} label="informes@litseacc.edu.mx" href="mailto:informes@litseacc.edu.mx" />
          <ContactItem icon={<Phone className="size-4" />} label="+52 984 233 7294" href="tel:+529842337294" />
          <ContactItem icon={<MapPin className="size-4" />} label="Av. Luis Donaldo Colosio, Lote 15 Manzana 38, Bosque Real, Playa del Carmen, Q. Roo, C.P. 77714" />
        </div>
      </div>
    </LegalShell>
  )
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="text-base font-bold text-[#1a1a1a] mb-3">
        <span className="text-[#2FB7A3] mr-2">{number}.</span>{title}
      </h2>
      <div className="text-sm text-[#5a5a5a] leading-relaxed space-y-3 [&_strong]:text-[#1a1a1a] [&_em]:text-[#4a4a4a] [&_a]:text-[#2FB7A3] [&_a]:hover:underline [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_li]:pl-4 [&_li]:relative [&_li]:before:content-['—'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-[#2FB7A3]/60">
        {children}
      </div>
    </div>
  )
}

function ContactItem({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) {
  const cls = 'flex items-start gap-2.5 text-[13px] text-[#5a5a5a] hover:text-[#2FB7A3] transition-colors'
  const inner = <><span className="mt-0.5 text-[#2FB7A3] shrink-0">{icon}</span><span>{label}</span></>
  if (href) return <a href={href} className={cls}>{inner}</a>
  return <div className={`${cls} cursor-default`}>{inner}</div>
}
