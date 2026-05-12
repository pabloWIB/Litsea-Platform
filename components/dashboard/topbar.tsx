'use client'

import { Button } from '@/components/ui/button'
import { LogOut, Bell, User } from 'lucide-react'

interface TopbarProps {
  user?: any
  onLogout?: () => void
}

export default function Topbar({ user, onLogout }: TopbarProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Bienvenido, {user?.email || 'Usuario'}</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user?.email || 'Usuario'}</p>
              <p className="text-xs text-gray-500">Empresa</p>
            </div>
            {onLogout && (
              <Button
                size="sm"
                onClick={onLogout}
                className="ml-2"
              >
                <LogOut size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}