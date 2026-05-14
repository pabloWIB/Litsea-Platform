import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import LegalShell from '@/components/legales/LegalShell'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pageTitles' })
  return {
    title: t('privacidad'),
    description: 'Aviso de privacidad de Litsea Bolsa de Trabajo. Conoce cómo tratamos y protegemos tus datos personales.',
  }
}

type SectionData = { title: string; content: React.ReactNode }
type PageContent = { intro: React.ReactNode; sections: SectionData[] }

function getContent(locale: string): PageContent {
  if (locale === 'en') return {
    intro: <p>Pursuant to the Federal Law on Protection of Personal Data Held by Private Parties, its Regulations and other applicable provisions, we inform you of our Privacy Policy and Personal Data Management Policy for the <strong>Litsea Job Board</strong> platform.</p>,
    sections: [
      {
        title: 'Data Controller',
        content: <p><strong>Litsea Centro de Capacitación, Salute per Acqua Riviera Maya</strong>, with address at Avenida Luis Donaldo Colosio, Lot 15, Block 38, Bosque Real, Playa del Carmen, Quintana Roo, ZIP 77714, is responsible for the use and protection of your personal data on the <em>empleos.litseacc.edu.mx</em> platform.</p>
      },
      {
        title: 'Personal data we collect',
        content: <>
          <p>For the operation of the platform we collect the following data, depending on user type:</p>
          <p><strong>Therapists:</strong> full name, email address, phone number, profile photo, therapeutic specialties, work zones, professional biography, years of experience and certification documents issued by Litsea Centro de Capacitación.</p>
          <p><strong>Employers:</strong> establishment name, representative name, email address, phone number, website, logo and business description.</p>
          <p><strong>All users:</strong> IP address, device type and browsing data necessary for the correct operation of the platform.</p>
        </>
      },
      {
        title: 'Use of your personal data',
        content: <>
          <p>The data we request will be used exclusively for:</p>
          <ul>
            <li>Creating and managing your account on the Litsea Job Board platform.</li>
            <li>Publishing and managing verified therapist profiles.</li>
            <li>Publishing and managing employer job vacancies.</li>
            <li>Facilitating the job application process.</li>
            <li>Verifying the authenticity of certificates issued by Litsea.</li>
            <li>Enabling communication between therapists and employers when authorized by the Litsea team.</li>
            <li>Sending notifications related to the status of your account or applications.</li>
            <li>Improving the platform user experience.</li>
          </ul>
          <p>The data you enter on the platform will <strong>not be disclosed, distributed or commercialized</strong> with third parties outside the described employment connection process.</p>
        </>
      },
      {
        title: 'Confidentiality',
        content: <p>All information provided by you will be treated as <strong>CONFIDENTIAL</strong>, with the sole legal exception of a judicial order from a competent authority, and persons you designate to receive notifications.</p>
      },
      {
        title: 'ARCO Rights',
        content: <>
          <p>You have the right to know what personal data we hold about you, for what purposes we use it and the conditions of such use (<strong>Access</strong>). You also have the right to request correction of your personal data if it is outdated, inaccurate or incomplete (<strong>Rectification</strong>); its deletion from our records or databases when you consider it is not being used appropriately (<strong>Cancellation</strong>); as well as to oppose the use of your personal data for specific purposes (<strong>Opposition</strong>).</p>
          <p>To exercise your ARCO rights, contact us at <strong>informes@litseacc.edu.mx</strong> or appear in person with valid official ID at our physical address.</p>
        </>
      },
      {
        title: 'Consent withdrawal',
        content: <p>If you wish to be removed from our database, you may at any time request the deletion of your account and data by email to <strong>informes@litseacc.edu.mx</strong> or in writing to our physical address.</p>
      },
      {
        title: 'Data transfers',
        content: <p>Your personal data may be shared only with employers or therapists involved in a contact process enabled by the Litsea team, always within the platform context. We do not transfer data to third parties outside this process without your prior consent.</p>
      },
      {
        title: 'Limitation of use and disclosure',
        content: <p>You may limit the use and disclosure of your personal information by registering in the Public Registry to Avoid Advertising (REPEP), managed by the Federal Consumer Protection Agency (PROFECO), so your data is not used for advertising or promotional purposes.</p>
      },
      {
        title: 'Use of tracking technologies',
        content: <p>Our platform uses cookies and similar technologies to monitor your behavior as a user, ensure session security and provide a better browsing experience. You may configure your browser to reject cookies, although this may affect some platform features. See our <a href="/cookies">Cookie Policy</a>.</p>
      },
      {
        title: 'Data security',
        content: <p>We implement technical and organizational measures to protect your personal information, including data encryption, role-based access control and secure file storage. Certificates and documents uploaded to the platform are stored on secure servers with controlled access.</p>
      },
      {
        title: 'Third-party links',
        content: <p>Users should be aware that when accessing this platform they may be directed to sites outside our control. Litsea Centro de Capacitación does not endorse, represent or guarantee the Privacy Policy or content of any third-party website linked to our platform.</p>
      },
      {
        title: 'Changes to this privacy notice',
        content: <p>This Privacy Notice may be modified due to new legal requirements, our own needs or changes in our operating model. We commit to keeping you informed of changes through the platform or by email.</p>
      },
      {
        title: 'Misuse',
        content: <p>Misuse of our electronic communication platform will be reported pursuant to applicable legislation.</p>
      },
    ]
  }

  if (locale === 'fr') return {
    intro: <p>En application de la Loi fédérale sur la protection des données personnelles détenues par des particuliers (LFPDPPP), son Règlement et autres dispositions applicables, nous vous informons de notre Politique de confidentialité et de gestion des données personnelles concernant la plateforme <strong>Litsea Bolsa de Trabajo</strong>.</p>,
    sections: [
      {
        title: 'Responsable du traitement',
        content: <p><strong>Litsea Centro de Capacitación, Salute per Acqua Riviera Maya</strong>, dont le siège est à l'Avenida Luis Donaldo Colosio, Lot 15, Manzana 38, Bosque Real, Playa del Carmen, Quintana Roo, C.P. 77714, est responsable de l'utilisation et de la protection de vos données personnelles sur la plateforme <em>empleos.litseacc.edu.mx</em>.</p>
      },
      {
        title: 'Données personnelles collectées',
        content: <>
          <p>Pour le fonctionnement de la plateforme, nous collectons les données suivantes selon le type d'utilisateur :</p>
          <p><strong>Thérapeutes :</strong> nom complet, adresse e-mail, téléphone, photo de profil, spécialités thérapeutiques, zones de travail, biographie professionnelle, années d'expérience et documents de certification émis par Litsea Centro de Capacitación.</p>
          <p><strong>Employeurs :</strong> nom de l'établissement, nom du représentant, adresse e-mail, téléphone, site web, logo et description de l'entreprise.</p>
          <p><strong>Tous les utilisateurs :</strong> adresse IP, type d'appareil et données de navigation nécessaires au bon fonctionnement de la plateforme.</p>
        </>
      },
      {
        title: 'Utilisation de vos données personnelles',
        content: <>
          <p>Les données que nous vous demandons seront utilisées exclusivement pour :</p>
          <ul>
            <li>Créer et gérer votre compte sur la plateforme Litsea Bolsa de Trabajo.</li>
            <li>Publier et gérer des profils de thérapeutes vérifiés.</li>
            <li>Publier et gérer des offres d'emploi pour les employeurs.</li>
            <li>Faciliter le processus de candidature aux offres d'emploi.</li>
            <li>Vérifier l'authenticité des certificats émis par Litsea.</li>
            <li>Activer la communication entre thérapeutes et employeurs lorsque l'équipe Litsea l'autorise.</li>
            <li>Envoyer des notifications relatives à l'état de votre compte ou de vos candidatures.</li>
            <li>Améliorer l'expérience utilisateur de la plateforme.</li>
          </ul>
          <p>Les données que vous saisissez sur la plateforme <strong>ne seront pas divulguées, distribuées ni commercialisées</strong> à des tiers en dehors du processus de mise en relation décrit.</p>
        </>
      },
      {
        title: 'Confidentialité',
        content: <p>Toutes les informations que vous nous fournissez seront traitées comme <strong>CONFIDENTIELLES</strong>, à la seule exception légale d'une ordonnance judiciaire émanant d'une autorité compétente, et des personnes que vous désignez pour recevoir les notifications.</p>
      },
      {
        title: "Droits d'accès (ARCO)",
        content: <>
          <p>Vous avez le droit de savoir quelles données personnelles nous détenons sur vous, à quelles fins nous les utilisons et dans quelles conditions (<strong>Accès</strong>). Vous avez également le droit de demander la correction de vos données personnelles si elles sont obsolètes, inexactes ou incomplètes (<strong>Rectification</strong>) ; leur suppression de nos registres si vous estimez qu'elles ne sont pas utilisées de manière appropriée (<strong>Suppression</strong>) ; ainsi que de vous opposer à l'utilisation de vos données à des fins spécifiques (<strong>Opposition</strong>).</p>
          <p>Pour exercer vos droits, contactez-nous à <strong>informes@litseacc.edu.mx</strong> ou présentez-vous en personne avec une pièce d'identité officielle valide à notre adresse.</p>
        </>
      },
      {
        title: 'Révocation du consentement',
        content: <p>Si vous souhaitez être supprimé de notre base de données, vous pouvez à tout moment demander la clôture de votre compte et la suppression de vos données par e-mail à <strong>informes@litseacc.edu.mx</strong> ou par écrit à notre adresse.</p>
      },
      {
        title: 'Transfert de données',
        content: <p>Vos données personnelles ne pourront être partagées qu'avec les employeurs ou thérapeutes impliqués dans un processus de contact autorisé par l'équipe Litsea, toujours dans le contexte de la plateforme. Nous ne procédons à aucun transfert à des tiers extérieurs à ce processus sans votre consentement préalable.</p>
      },
      {
        title: "Limitation d'utilisation et de divulgation",
        content: <p>Vous pouvez limiter l'utilisation et la divulgation de vos informations personnelles en vous inscrivant au Registre public pour éviter la publicité (REPEP), géré par la PROFECO, afin que vos données ne soient pas utilisées à des fins publicitaires.</p>
      },
      {
        title: 'Technologies de traçage',
        content: <p>Notre plateforme utilise des cookies et technologies similaires pour surveiller votre comportement, assurer la sécurité de la session et améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour refuser les cookies, bien que cela puisse affecter certaines fonctionnalités. Consultez notre <a href="/cookies">Politique de cookies</a>.</p>
      },
      {
        title: 'Sécurité des données',
        content: <p>Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos informations personnelles, notamment le chiffrement des données, le contrôle d'accès par rôles et le stockage sécurisé des fichiers. Les certificats et documents téléchargés sont stockés sur des serveurs sécurisés à accès contrôlé.</p>
      },
      {
        title: 'Liens vers des sites tiers',
        content: <p>Les utilisateurs doivent savoir qu'en accédant à cette plateforme, ils peuvent être redirigés vers des sites hors de notre contrôle. Litsea Centro de Capacitación n'approuve pas, ne représente pas et ne garantit pas la politique de confidentialité ou le contenu de tout site tiers lié à notre plateforme.</p>
      },
      {
        title: 'Modifications de cet avis',
        content: <p>Le présent Avis de confidentialité peut être modifié en raison de nouvelles exigences légales, de nos propres besoins ou de changements dans notre modèle d'exploitation. Nous nous engageons à vous informer des modifications via la plateforme ou par e-mail.</p>
      },
      {
        title: 'Usage abusif',
        content: <p>L'utilisation abusive de notre plateforme de communication électronique sera signalée conformément à la législation applicable.</p>
      },
    ]
  }

  return {
    intro: <p>Con fundamento en lo establecido por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, su Reglamento y demás disposiciones aplicables, le informamos nuestra Política de Privacidad y Manejo de Datos Personales correspondiente a la plataforma <strong>Litsea Bolsa de Trabajo</strong>.</p>,
    sections: [
      {
        title: 'Responsable de sus datos',
        content: <p><strong>Litsea Centro de Capacitación, Salute per Acqua Riviera Maya</strong>, con domicilio en Avenida Luis Donaldo Colosio, Lote 15 Manzana 38, Bosque Real, Playa del Carmen, Quintana Roo, C.P. 77714, es el responsable del uso y protección de sus datos personales dentro de la plataforma <em>empleos.litseacc.edu.mx</em>.</p>
      },
      {
        title: 'Datos personales que recabamos',
        content: <>
          <p>Para la operación de la plataforma recopilamos los siguientes datos, según el tipo de usuario:</p>
          <p><strong>Terapeutas:</strong> nombre completo, correo electrónico, teléfono, fotografía de perfil, especialidades terapéuticas, zonas de trabajo, biografía profesional, años de experiencia y documentos de certificación emitidos por Litsea Centro de Capacitación.</p>
          <p><strong>Empleadores:</strong> nombre del establecimiento, nombre del representante, correo electrónico, teléfono, sitio web, logotipo y descripción del negocio.</p>
          <p><strong>Todos los usuarios:</strong> dirección IP, tipo de dispositivo y datos de navegación necesarios para el correcto funcionamiento de la plataforma.</p>
        </>
      },
      {
        title: 'Uso de sus datos personales',
        content: <>
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
          <p>Los datos que ingrese en la plataforma <strong>no serán difundidos, distribuidos ni comercializados</strong> con terceros fuera del proceso de conexión laboral descrito.</p>
        </>
      },
      {
        title: 'Confidencialidad',
        content: <p>Toda la información proporcionada por usted será tratada como <strong>CONFIDENCIAL</strong>, con la única excepción legal para el caso de mandamiento judicial en forma por autoridad competente, y de las personas que usted mismo disponga para oír y recibir notificaciones.</p>
      },
      {
        title: 'Derechos ARCO',
        content: <>
          <p>Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (<strong>Acceso</strong>). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (<strong>Rectificación</strong>); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente (<strong>Cancelación</strong>); así como oponerse al uso de sus datos personales para fines específicos (<strong>Oposición</strong>).</p>
          <p>Para ejercer sus derechos ARCO puede contactarnos a través del correo <strong>informes@litseacc.edu.mx</strong> o presentarse personalmente con identificación oficial vigente en nuestra dirección física.</p>
        </>
      },
      {
        title: 'Revocación del consentimiento',
        content: <p>En caso de que desee ser removido de nuestra base de datos, podrá en cualquier momento solicitar la baja de su cuenta y sus datos mediante correo electrónico a <strong>informes@litseacc.edu.mx</strong> o por escrito dirigido a nuestra dirección física.</p>
      },
      {
        title: 'Transferencia de datos',
        content: <p>Sus datos personales podrán ser compartidos únicamente con los empleadores o terapeutas involucrados en un proceso de contacto que haya sido habilitado por el equipo de Litsea, siempre dentro del contexto de la plataforma. No realizamos transferencias a terceros ajenos a dicho proceso sin su consentimiento previo.</p>
      },
      {
        title: 'Limitación de uso y divulgación',
        content: <p>Puede limitar el uso y divulgación de su información personal a través de su inscripción en el Registro Público para Evitar Publicidad (REPEP), a cargo de la Procuraduría Federal del Consumidor (PROFECO), con la finalidad de que sus datos no sean utilizados para recibir publicidad o promociones.</p>
      },
      {
        title: 'Uso de tecnologías de rastreo',
        content: <p>Le informamos que en nuestra plataforma utilizamos cookies y tecnologías similares para monitorear su comportamiento como usuario, garantizar la seguridad de la sesión y brindarle una mejor experiencia de navegación. Puede configurar su navegador para rechazar cookies, aunque esto podría afectar el funcionamiento de algunas funciones de la plataforma. Consulte nuestra <a href="/cookies">Política de Cookies</a>.</p>
      },
      {
        title: 'Seguridad de sus datos',
        content: <p>Implementamos medidas técnicas y organizativas para proteger su información personal, incluyendo cifrado de datos, acceso restringido por roles y almacenamiento seguro de archivos. Los certificados y documentos subidos a la plataforma se almacenan en servidores seguros con acceso controlado.</p>
      },
      {
        title: 'Enlaces a sitios de terceros',
        content: <p>Los usuarios deben saber que al acceder a esta plataforma pueden ser dirigidos a sitios que están fuera de nuestro control. Litsea Centro de Capacitación no endosa, representa ni garantiza la Política de Privacidad o el contenido de ningún sitio propiedad de terceros que tenga enlaces con nuestra plataforma.</p>
      },
      {
        title: 'Cambios al aviso de privacidad',
        content: <p>El presente Aviso de Privacidad puede sufrir modificaciones derivadas de nuevos requerimientos legales, de nuestras propias necesidades o de cambios en nuestro modelo de operación. Nos comprometemos a mantenerle informado sobre los cambios a través de la plataforma o por correspondencia electrónica.</p>
      },
      {
        title: 'Uso indebido',
        content: <p>El uso indebido de nuestra plataforma de comunicación electrónica será denunciado en términos de la legislación aplicable vigente.</p>
      },
    ]
  }
}

export default async function PrivacidadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  const content = getContent(locale)

  return (
    <LegalShell>
      <div className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">{t('label')}</p>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#0d1f1c] leading-[0.95] mb-4">
          {locale === 'en' ? <>Privacy<br /><span className="text-[#2FB7A3]">notice.</span></> :
           locale === 'fr' ? <>Avis de<br /><span className="text-[#2FB7A3]">confidentialité.</span></> :
           <>Aviso de<br /><span className="text-[#2FB7A3]">privacidad.</span></>}
        </h1>
        <p className="text-sm text-[#8a8a8a]">{t('lastUpdated')}</p>
      </div>

      <div className="text-sm text-[#5a5a5a] leading-relaxed mb-2">{content.intro}</div>

      <div className="space-y-0">
        {content.sections.map((s, i) => (
          <Section key={i} title={s.title}>{s.content}</Section>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-black/8 bg-white p-8">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-5">{t('contactInfo')}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <ContactItem icon={<Mail className="size-4" />} label="informes@litseacc.edu.mx" href="mailto:informes@litseacc.edu.mx" />
          <ContactItem icon={<Phone className="size-4" />} label="+52 (984) 118 5592" href="tel:+529841185592" />
          <ContactItem icon={<MapPin className="size-4" />} label="Av. Luis Donaldo Colosio, Lote 15 Manzana 38, Bosque Real, Playa del Carmen, Q. Roo, C.P. 77714" />
          <ContactItem icon={<Globe className="size-4" />} label="litseacc.edu.mx" href="https://litseacc.edu.mx" external />
        </div>
        <p className="text-[12px] text-[#c0c0c0] mt-6 leading-relaxed">{t('contactNote')}</p>
      </div>
    </LegalShell>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="text-base font-bold text-[#1a1a1a] mb-3">{title}</h2>
      <div className="text-sm text-[#5a5a5a] leading-relaxed space-y-3 [&_strong]:text-[#1a1a1a] [&_em]:text-[#4a4a4a] [&_a]:text-[#2FB7A3] [&_a]:hover:underline [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_li]:pl-4 [&_li]:relative [&_li]:before:content-['—'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-[#2FB7A3]/60">
        {children}
      </div>
    </div>
  )
}

function ContactItem({ icon, label, href, external }: { icon: React.ReactNode; label: string; href?: string; external?: boolean }) {
  const cls = 'flex items-start gap-2.5 text-[13px] text-[#5a5a5a] hover:text-[#2FB7A3] transition-colors'
  const inner = <><span className="mt-0.5 text-[#2FB7A3] shrink-0">{icon}</span><span>{label}</span></>
  if (href) return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={cls}>{inner}</a>
  return <div className={`${cls} cursor-default`}>{inner}</div>
}
