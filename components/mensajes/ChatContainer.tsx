'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Send, MessageCircle } from 'lucide-react'

export type ConvSummary = {
  id: string
  otherName: string
  otherAvatar: string | null
  vacancyTitle: string
}

type Message = {
  id: string
  sender_id: string
  body: string
  created_at: string
  read_at: string | null
}

interface Props {
  conversations: ConvSummary[]
  currentUserId: string
  emptyDescription?: string
}

export default function ChatContainer({
  conversations,
  currentUserId,
  emptyDescription = 'Las conversaciones aparecen cuando Litsea habilita el chat.',
}: Props) {
  const supabase        = createClient()
  const messagesEndRef  = useRef<HTMLDivElement>(null)

  const [selectedId,   setSelectedId]   = useState<string | null>(conversations[0]?.id ?? null)
  const [messages,     setMessages]     = useState<Message[]>([])
  const [loading,      setLoading]      = useState(false)
  const [text,         setText]         = useState('')

  const selected = conversations.find(c => c.id === selectedId)

  useEffect(() => {
    if (!selectedId) return
    let alive = true

    const load = async () => {
      setLoading(true)
      setMessages([])

      const { data } = await supabase
        .from('messages')
        .select('id, sender_id, body, created_at, read_at')
        .eq('conversation_id', selectedId)
        .order('created_at', { ascending: true })

      if (alive) {
        setMessages((data ?? []) as Message[])
        setLoading(false)
      }

      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', selectedId)
        .is('read_at', null)
        .neq('sender_id', currentUserId)
    }

    load()

    const channel = supabase
      .channel(`chat-${selectedId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedId}` },
        (payload) => {
          const msg = payload.new as Message
          setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg])

          if (msg.sender_id !== currentUserId) {
            supabase.from('messages')
              .update({ read_at: new Date().toISOString() })
              .eq('id', msg.id)
              .then(() => {})
          }
        },
      )
      .subscribe()

    return () => {
      alive = false
      supabase.removeChannel(channel)
    }
  }, [selectedId, currentUserId]) 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const send = async () => {
    const body = text.trim()
    if (!body || !selectedId) return
    setText('')

    const { data } = await supabase
      .from('messages')
      .insert({ conversation_id: selectedId, sender_id: currentUserId, body })
      .select()
      .single()

    if (data) {
      setMessages(prev => prev.some(m => m.id === data.id) ? prev : [...prev, data as Message])
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 px-4 text-center">
        <div className="size-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
          <MessageCircle className="size-7 text-neutral-400" />
        </div>
        <p className="text-sm font-semibold text-neutral-700 mb-1">
          No tienes conversaciones activas
        </p>
        <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
          {emptyDescription}
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full overflow-hidden">

      <div className="w-64 md:w-72 shrink-0 border-r border-neutral-100 flex flex-col overflow-y-auto bg-white">
        <div className="px-4 py-4 border-b border-neutral-100 shrink-0">
          <h2 className="text-[13px] font-bold text-neutral-500 uppercase tracking-widest">
            Conversaciones
          </h2>
        </div>

        {conversations.map(conv => {
          const active = conv.id === selectedId
          return (
            <button key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-r-2 transition-colors ${
                active
                  ? 'bg-[#2FB7A3]/8 border-[#2FB7A3]'
                  : 'border-transparent hover:bg-neutral-50'
              }`}
            >
              <div className="relative size-10 rounded-full overflow-hidden bg-[#2FB7A3]/15 border border-neutral-200 flex items-center justify-center text-[#2FB7A3] font-bold text-sm shrink-0">
                {conv.otherAvatar ? (
                  <Image src={conv.otherAvatar} alt={conv.otherName} fill sizes="40px" className="object-cover" />
                ) : (
                  conv.otherName.slice(0, 2).toUpperCase()
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-neutral-800 truncate">{conv.otherName}</p>
                <p className="text-xs text-neutral-400 truncate">{conv.vacancyTitle}</p>
              </div>
            </button>
          )
        })}
      </div>

      {selected ? (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          <div className="px-5 py-4 border-b border-neutral-100 bg-white shrink-0">
            <p className="text-[15px] font-bold text-neutral-900 leading-tight">{selected.otherName}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{selected.vacancyTitle}</p>
            <p className="text-[10px] text-[#2FB7A3] font-bold uppercase tracking-wider mt-1">
              Chat habilitado por Litsea
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-neutral-50">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="size-5 border-2 border-[#2FB7A3] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-sm text-neutral-400 py-10">
                No hay mensajes aún. ¡Empieza la conversación!
              </p>
            ) : (
              messages.map(msg => {
                const own = msg.sender_id === currentUserId
                return (
                  <div key={msg.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      own
                        ? 'bg-[#2FB7A3] text-white rounded-br-sm'
                        : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-sm'
                    }`}>
                      <p>{msg.body}</p>
                      <p className={`text-[10px] mt-1.5 ${own ? 'text-white/65 text-right' : 'text-neutral-400'}`}>
                        {new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit' })
                          .format(new Date(msg.created_at))}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-3 border-t border-neutral-100 bg-white shrink-0 flex items-end gap-3">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe un mensaje… (Enter para enviar)"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent max-h-32 overflow-y-auto"
            />
            <button
              onClick={send}
              disabled={!text.trim()}
              className="size-10 rounded-full bg-[#2FB7A3] flex items-center justify-center text-white shrink-0 transition hover:bg-[#239688] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="size-4" />
            </button>
          </div>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">
          Selecciona una conversación
        </div>
      )}
    </div>
  )
}
