import Footer from '@/components/layout/Footer'
import LegalNavbar from './LegalNavbar'

export default function LegalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FDFAF5' }}>
      <LegalNavbar />
      <main className="flex-1 px-4 pt-24 pb-20">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
