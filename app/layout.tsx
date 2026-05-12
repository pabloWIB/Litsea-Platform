import type { ReactNode } from 'react'

// Root layout exists to satisfy Next.js and handle /not-found.
// html/body with lang attribute are rendered in app/[locale]/layout.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
