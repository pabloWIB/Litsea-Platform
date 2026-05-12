'use client'

import { createContext, useContext } from 'react'

interface BannerContextValue {
  open: boolean
  topbarHeight: number
}

export const BannerContext = createContext<BannerContextValue>({ open: true, topbarHeight: 0 })
export const useBannerOpen   = () => useContext(BannerContext).open
export const useTopbarHeight = () => useContext(BannerContext).topbarHeight
