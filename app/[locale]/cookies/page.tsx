import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Mail } from 'lucide-react'
import LegalShell from '@/components/legales/LegalShell'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pageTitles' })
  return {
    title: t('cookies'),
    description: 'Política de cookies de Litsea Bolsa de Trabajo.',
  }
}

/* ─── Cookie type card ─── */

type CookieTypeData = { name: string; purpose: string; examples: string; duration: string; optional: boolean }
type LocaleLabels = { essential: string; optional: string; examplesLabel: string; durationLabel: string }

function CookieCard({ ct, labels }: { ct: CookieTypeData; labels: LocaleLabels }) {
  return (
    <div className="rounded-xl border border-black/6 bg-white p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold text-[#1a1a1a]">{ct.name}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: ct.optional ? '#f3f4f6' : 'rgba(47,183,163,0.1)', color: ct.optional ? '#6b7280' : '#2FB7A3' }}>
          {ct.optional ? labels.optional : labels.essential}
        </span>
      </div>
      <p className="text-[13px] text-[#5a5a5a] leading-relaxed mb-2">{ct.purpose}</p>
      <div className="flex flex-col gap-1 text-[12px] text-[#8a8a8a]">
        <span><strong className="text-[#4a4a4a]">{labels.examplesLabel}:</strong> {ct.examples}</span>
        <span><strong className="text-[#4a4a4a]">{labels.durationLabel}:</strong> {ct.duration}</span>
      </div>
    </div>
  )
}

/* ─── Content by locale ─── */

type SectionData = { title: string; content: React.ReactNode }
type PageContent = { intro: React.ReactNode; sections: SectionData[]; labels: LocaleLabels; cookieTypes: CookieTypeData[] }

function getContent(locale: string): PageContent {
  if (locale === 'en') return {
    intro: <p>This Cookie Policy explains what cookies are, how <strong>Litsea Job Board</strong> uses them on the <em>empleos.litseacc.edu.mx</em> platform, and how you can control their use.</p>,
    labels: { essential: 'Essential', optional: 'Optional', examplesLabel: 'Examples', durationLabel: 'Duration' },
    cookieTypes: [
      { name: 'Essential cookies', purpose: 'Necessary for the platform to function. Without them, services such as login, account management and session security would not work correctly.', examples: 'Supabase authentication session, CSRF security tokens.', duration: 'Session duration or up to 7 days with remembered session.', optional: false },
      { name: 'Preference cookies', purpose: 'Remember your language preference (ES / EN / FR) so you don\'t have to select it every time you visit the platform.', examples: 'Language preference (next-intl).', duration: 'Up to 1 year.', optional: false },
      { name: 'Analytics cookies', purpose: 'Help us understand how users interact with the platform to improve its functionality. Data is collected anonymously and in aggregate form.', examples: 'Google Analytics (when implemented).', duration: 'Up to 2 years.', optional: true },
    ],
    sections: [
      { title: 'What are cookies?', content: <p>Cookies are small text files that websites store on your device when you visit them. They are used to remember your preferences, keep your session active and improve the platform experience.</p> },
      { title: 'Cookies we use', content: <p>On Litsea Job Board we use the following types of cookies:</p> },
      { title: 'Third-party cookies', content: <>
        <p>Some third-party services used on the platform may set their own cookies. Litsea does not control the behavior of these cookies. The main third parties are:</p>
        <ul>
          <li><strong>Supabase</strong> — authentication and database provider. Uses session cookies to manage authenticated access. See the <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase privacy policy</a>.</li>
          <li><strong>Google OAuth</strong> — when you sign in with Google, Google may set its own cookies. See the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy policy</a>.</li>
        </ul>
      </> },
      { title: 'How to manage cookies', content: <>
        <p>You can control and delete cookies through your browser settings. Note that disabling essential cookies may prevent the platform from working correctly, including login.</p>
        <ul>
          <li><strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data.</li>
          <li><strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data.</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data.</li>
          <li><strong>Microsoft Edge:</strong> Settings → Privacy, search, and services → Cookies.</li>
        </ul>
      </> },
      { title: 'Consent', content: <p>By using the Litsea Job Board platform, you accept the use of cookies described in this policy. Essential cookies are installed automatically as they are necessary for the service to function.</p> },
      { title: 'Updates to this policy', content: <p>This Cookie Policy may be updated occasionally to reflect changes in the services we use or applicable legislation. We recommend reviewing it periodically.</p> },
      { title: 'Applicable law', content: <p>This policy is governed by the Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP) and other applicable Mexican regulations. For more information on the processing of your personal data, see our <a href="/privacidad">Privacy Notice</a>.</p> },
    ]
  }

  if (locale === 'fr') return {
    intro: <p>Cette Politique de cookies explique ce que sont les cookies, comment <strong>Litsea Bolsa de Trabajo</strong> les utilise sur la plateforme <em>empleos.litseacc.edu.mx</em>, et comment vous pouvez contrôler leur utilisation.</p>,
    labels: { essential: 'Essentiel', optional: 'Facultatif', examplesLabel: 'Exemples', durationLabel: 'Durée' },
    cookieTypes: [
      { name: 'Cookies essentiels', purpose: 'Nécessaires au fonctionnement de la plateforme. Sans eux, des services tels que la connexion, la gestion du compte et la sécurité de la session ne fonctionneraient pas correctement.', examples: 'Session d\'authentification Supabase, tokens de sécurité CSRF.', duration: 'Durée de la session ou jusqu\'à 7 jours avec session mémorisée.', optional: false },
      { name: 'Cookies de préférences', purpose: 'Mémorisent vos préférences linguistiques (ES / EN / FR) afin que vous n\'ayez pas à les sélectionner à chaque visite.', examples: 'Préférence de langue (next-intl).', duration: 'Jusqu\'à 1 an.', optional: false },
      { name: 'Cookies analytiques', purpose: 'Nous aident à comprendre comment les utilisateurs interagissent avec la plateforme pour en améliorer le fonctionnement. Les données sont collectées de manière anonyme et agrégée.', examples: 'Google Analytics (lorsque mis en œuvre).', duration: 'Jusqu\'à 2 ans.', optional: true },
    ],
    sections: [
      { title: 'Que sont les cookies ?', content: <p>Les cookies sont de petits fichiers texte que les sites web enregistrent sur votre appareil lorsque vous les visitez. Ils servent à mémoriser vos préférences, maintenir votre session active et améliorer l'expérience sur la plateforme.</p> },
      { title: 'Cookies que nous utilisons', content: <p>Sur Litsea Bolsa de Trabajo, nous utilisons les types de cookies suivants :</p> },
      { title: 'Cookies tiers', content: <>
        <p>Certains services tiers utilisés sur la plateforme peuvent déposer leurs propres cookies. Litsea ne contrôle pas le comportement de ces cookies. Les principaux tiers sont :</p>
        <ul>
          <li><strong>Supabase</strong> — fournisseur d'authentification et de base de données. Utilise des cookies de session pour gérer l'accès authentifié. Voir la <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">politique de confidentialité de Supabase</a>.</li>
          <li><strong>Google OAuth</strong> — lorsque vous vous connectez avec Google, Google peut déposer ses propres cookies. Voir la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">politique de confidentialité de Google</a>.</li>
        </ul>
      </> },
      { title: 'Comment gérer les cookies', content: <>
        <p>Vous pouvez contrôler et supprimer les cookies via les paramètres de votre navigateur. Veuillez noter que la désactivation des cookies essentiels peut empêcher le bon fonctionnement de la plateforme, y compris la connexion.</p>
        <ul>
          <li><strong>Google Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies et autres données des sites.</li>
          <li><strong>Mozilla Firefox :</strong> Options → Vie privée et sécurité → Cookies et données de sites.</li>
          <li><strong>Safari :</strong> Préférences → Confidentialité → Gérer les données des sites web.</li>
          <li><strong>Microsoft Edge :</strong> Paramètres → Confidentialité, recherche et services → Cookies.</li>
        </ul>
      </> },
      { title: 'Consentement', content: <p>En utilisant la plateforme Litsea Bolsa de Trabajo, vous acceptez l'utilisation des cookies décrits dans cette politique. Les cookies essentiels sont installés automatiquement car ils sont nécessaires au fonctionnement du service.</p> },
      { title: 'Mises à jour de cette politique', content: <p>Cette Politique de cookies peut être mise à jour occasionnellement pour refléter des changements dans les services utilisés ou la législation applicable. Nous vous recommandons de la consulter régulièrement.</p> },
      { title: 'Droit applicable', content: <p>Cette politique est régie par la Loi fédérale sur la protection des données personnelles détenues par des particuliers (LFPDPPP) et autres réglementations mexicaines applicables. Pour plus d'informations, consultez notre <a href="/privacidad">Avis de confidentialité</a>.</p> },
    ]
  }

  // Español
  return {
    intro: <p>Esta Política de Cookies explica qué son las cookies, cómo las utiliza <strong>Litsea Bolsa de Trabajo</strong> en la plataforma <em>empleos.litseacc.edu.mx</em> y cómo puedes controlar su uso.</p>,
    labels: { essential: 'Esencial', optional: 'Opcional', examplesLabel: 'Ejemplos', durationLabel: 'Duración' },
    cookieTypes: [
      { name: 'Cookies esenciales', purpose: 'Necesarias para el funcionamiento de la plataforma. Sin ellas, servicios como el inicio de sesión, la gestión de tu cuenta y la seguridad de la sesión no funcionarían correctamente.', examples: 'Sesión de autenticación Supabase, tokens de seguridad CSRF.', duration: 'Duración de la sesión o hasta 7 días con sesión recordada.', optional: false },
      { name: 'Cookies de preferencias', purpose: 'Recuerdan tus preferencias de idioma (ES / EN / FR) para que no tengas que seleccionarlo cada vez que visitas la plataforma.', examples: 'Preferencia de idioma (next-intl).', duration: 'Hasta 1 año.', optional: false },
      { name: 'Cookies analíticas', purpose: 'Nos ayudan a entender cómo los usuarios interactúan con la plataforma para mejorar su funcionamiento. Los datos se recopilan de forma anónima y agregada.', examples: 'Google Analytics (cuando se implemente).', duration: 'Hasta 2 años.', optional: true },
    ],
    sections: [
      { title: '¿Qué son las cookies?', content: <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas. Sirven para recordar tus preferencias, mantener tu sesión activa y mejorar la experiencia de uso de la plataforma.</p> },
      { title: 'Cookies que utilizamos', content: <p>En Litsea Bolsa de Trabajo utilizamos los siguientes tipos de cookies:</p> },
      { title: 'Cookies de terceros', content: <>
        <p>Algunos servicios de terceros utilizados en la plataforma pueden establecer sus propias cookies. Litsea no controla el comportamiento de estas cookies. Los principales terceros son:</p>
        <ul>
          <li><strong>Supabase</strong> — proveedor de autenticación y base de datos. Utiliza cookies de sesión para gestionar el acceso autenticado. Consulta la <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidad de Supabase</a>.</li>
          <li><strong>Google OAuth</strong> — cuando inicias sesión con Google, Google puede establecer sus propias cookies. Consulta la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidad de Google</a>.</li>
        </ul>
      </> },
      { title: '¿Cómo gestionar las cookies?', content: <>
        <p>Puedes controlar y eliminar las cookies a través de la configuración de tu navegador. Ten en cuenta que desactivar las cookies esenciales puede impedir el correcto funcionamiento de la plataforma, incluyendo el inicio de sesión.</p>
        <ul>
          <li><strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios.</li>
          <li><strong>Mozilla Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio.</li>
          <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web.</li>
          <li><strong>Microsoft Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies.</li>
        </ul>
      </> },
      { title: 'Consentimiento', content: <p>Al utilizar la plataforma Litsea Bolsa de Trabajo, aceptas el uso de las cookies descritas en esta política. Las cookies esenciales se instalan automáticamente ya que son necesarias para el funcionamiento del servicio.</p> },
      { title: 'Actualizaciones de esta política', content: <p>Esta Política de Cookies puede actualizarse ocasionalmente para reflejar cambios en los servicios que utilizamos o en la legislación aplicable. Te recomendamos revisarla periódicamente.</p> },
      { title: 'Legislación aplicable', content: <p>Esta política se rige por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y demás normatividad aplicable en los Estados Unidos Mexicanos. Para más información, consulta nuestro <a href="/privacidad">Aviso de Privacidad</a>.</p> },
    ]
  }
}

/* ─── Page ─── */

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  const content = getContent(locale)

  return (
    <LegalShell>
      <div className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">{t('label')}</p>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#0d1f1c] leading-[0.95] mb-4">
          {locale === 'en' ? <>Cookie<br /><span className="text-[#2FB7A3]">policy.</span></> :
           locale === 'fr' ? <>Politique de<br /><span className="text-[#2FB7A3]">cookies.</span></> :
           <>Política de<br /><span className="text-[#2FB7A3]">cookies.</span></>}
        </h1>
        <p className="text-sm text-[#8a8a8a]">{t('lastUpdated')}</p>
      </div>

      <div className="text-sm text-[#5a5a5a] leading-relaxed mb-2">{content.intro}</div>

      <div className="space-y-0">
        {content.sections.map((s, i) => (
          <Section key={i} title={s.title}>
            {s.content}
            {i === 1 && (
              <div className="mt-4 space-y-3">
                {content.cookieTypes.map((ct, j) => (
                  <CookieCard key={j} ct={ct} labels={content.labels} />
                ))}
              </div>
            )}
          </Section>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-black/8 bg-white p-8">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">{t('contactInfo')}</p>
        <p className="text-sm text-[#5a5a5a] mb-3">
          {locale === 'en' ? 'If you have questions about this Cookie Policy, contact us at:' :
           locale === 'fr' ? 'Pour toute question sur cette Politique de cookies, contactez-nous à :' :
           'Si tienes preguntas sobre esta Política de Cookies, puedes contactarnos en:'}
        </p>
        <a href="mailto:informes@litseacc.edu.mx"
          className="inline-flex items-center gap-2.5 text-[13px] text-[#5a5a5a] hover:text-[#2FB7A3] transition-colors">
          <Mail className="size-4 text-[#2FB7A3] shrink-0" />
          informes@litseacc.edu.mx
        </a>
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
