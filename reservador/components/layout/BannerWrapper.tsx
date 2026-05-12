'use client'

import { useState, useEffect } from 'react'
import FechasBanner from '@/components/ui/FechasBanner'
import { BannerContext } from '@/context/BannerContext'

export default function BannerWrapper() {
  const [open,      setOpen]      = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return
      setOpen(window.scrollY <= 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dismissed])

  const handleClose = () => {
    setDismissed(true)
    setOpen(false)
  }

  return (
    <BannerContext.Provider value={{ open, topbarHeight: 0 }}>
      <FechasBanner open={open} onClose={handleClose} />
    </BannerContext.Provider>
  )
}
