'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  Check, X, Moon, Sun, Loader2,
} from 'lucide-react'

type Plan = {
  id:         string
  name:       string
  price: number
  is_flat:    boolean
  active:  boolean
  sort_order: number
  created_at: string
}

type AddForm = {
  name:       string
  price: string
  is_flat:    boolean
  active:  boolean
}

type EditForm = {
  name:       string
  price: string
  is_flat:    boolean
}

const EMPTY_ADD: AddForm = { name: '', price: '', is_flat: false, active: true }

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('es-CO')
}

const input = 'w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl bg-white text-neutral-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15 transition-all placeholder:text-neutral-400'

export default function PlansList({ plans: initial }: { plans: Plan[] }) {
  const [plans,     setPlans]     = useState<Plan[]>(initial)
  const [editId,    setEditId]    = useState<string | null>(null)
  const [editForm,  setEditForm]  = useState<EditForm>({ name: '', price: '', is_flat: false })
  const [showAdd,   setShowAdd]   = useState(false)
  const [addForm,   setAddForm]   = useState<AddForm>(EMPTY_ADD)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [savingAdd, setSavingAdd] = useState(false)
  const [deleteId,  setDeleteId]  = useState<string | null>(null)

  // ── Helpers ────────────────────────────────────────────────────
  async function patchPlan(id: string, fields: Partial<Plan>) {
    const r = await fetch(`/api/plans/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(fields),
    })
    if (!r.ok) throw new Error('Error al actualizar el plan')
    const { data } = await r.json()
    return data as Plan
  }

  function updateLocal(id: string, fields: Partial<Plan>) {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...fields } : p))
  }

  // ── Toggle active ──────────────────────────────────────────────
  async function toggleActive(plan: Plan) {
    setLoadingId(plan.id)
    try {
      await patchPlan(plan.id, { active: !plan.active })
      updateLocal(plan.id, { active: !plan.active })
      toast.success(plan.active ? 'Plan desactivado' : 'Plan activado')
    } catch { toast.error('Error al cambiar el estado') }
    finally { setLoadingId(null) }
  }

  // ── Reorder ────────────────────────────────────────────────────
  async function move(plan: Plan, dir: 'up' | 'down') {
    const sorted  = [...plans].sort((a, b) => a.sort_order - b.sort_order)
    const idx     = sorted.findIndex(p => p.id === plan.id)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const other = sorted[swapIdx]
    setLoadingId(plan.id)
    try {
      await Promise.all([
        patchPlan(plan.id,  { sort_order: other.sort_order }),
        patchPlan(other.id, { sort_order: plan.sort_order  }),
      ])
      setPlans(prev => prev.map(p => {
        if (p.id === plan.id)  return { ...p, sort_order: other.sort_order }
        if (p.id === other.id) return { ...p, sort_order: plan.sort_order  }
        return p
      }))
    } catch { toast.error('Error al reordenar') }
    finally { setLoadingId(null) }
  }

  // ── Start edit ─────────────────────────────────────────────────
  function startEdit(plan: Plan) {
    setEditId(plan.id)
    setEditForm({ name: plan.name, price: String(plan.price), is_flat: plan.is_flat })
  }

  // ── Save edit ──────────────────────────────────────────────────
  async function saveEdit(plan: Plan) {
    if (!editForm.name.trim()) { toast.error('El nombre es obligatorio'); return }
    const price = Number(editForm.price)
    if (!price || price <= 0) { toast.error('El precio debe ser mayor a 0'); return }

    setLoadingId(plan.id)
    try {
      await patchPlan(plan.id, { name: editForm.name.trim(), price: price, is_flat: editForm.is_flat })
      updateLocal(plan.id, { name: editForm.name.trim(), price: price, is_flat: editForm.is_flat })
      setEditId(null)
      toast.success('Plan actualizado')
    } catch { toast.error('Error al guardar') }
    finally { setLoadingId(null) }
  }

  // ── Delete ─────────────────────────────────────────────────────
  async function deletePlan(id: string) {
    setLoadingId(id)
    try {
      const r = await fetch(`/api/plans/${id}`, { method: 'DELETE' })
      if (!r.ok) throw new Error()
      setPlans(prev => prev.filter(p => p.id !== id))
      setDeleteId(null)
      toast.success('Plan eliminado')
    } catch { toast.error('Error al eliminar') }
    finally { setLoadingId(null) }
  }

  // ── Add new plan ───────────────────────────────────────────────
  async function createPlan() {
    if (!addForm.name.trim()) { toast.error('El nombre es obligatorio'); return }
    const price = Number(addForm.price)
    if (!price || price <= 0) { toast.error('El precio debe ser mayor a 0'); return }

    setSavingAdd(true)
    try {
      const maxOrder = Math.max(0, ...plans.map(p => p.sort_order))
      const r = await fetch('/api/plans', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:       addForm.name.trim(),
          price: price,
          is_flat:    addForm.is_flat,
          active:  addForm.active,
          sort_order: maxOrder + 1,
        }),
      })
      if (!r.ok) throw new Error()
      const { data } = await r.json()
      setPlans(prev => [...prev, data])
      setAddForm(EMPTY_ADD)
      setShowAdd(false)
      toast.success('Plan creado')
    } catch { toast.error('Error al crear el plan') }
    finally { setSavingAdd(false) }
  }

  const sorted = [...plans].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="space-y-3">

      {/* Add new plan form */}
      {showAdd ? (
        <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-5 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-500">Nuevo plan</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Nombre del plan</label>
              <input
                type="text"
                placeholder="Ej: Plan pareja fin de semana"
                value={addForm.name}
                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                className={input}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Precio (COP)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                <input
                  type="number"
                  placeholder="420000"
                  value={addForm.price}
                  onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
                  className={`${input} pl-7`}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setAddForm(f => ({ ...f, is_flat: !f.is_flat }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${addForm.is_flat ? 'bg-orange-500' : 'bg-neutral-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${addForm.is_flat ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-neutral-600">
                {addForm.is_flat ? 'Tarifa plana' : 'Por noche'}
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setAddForm(f => ({ ...f, active: !f.active }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${addForm.active ? 'bg-green-500' : 'bg-neutral-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${addForm.active ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-neutral-600">{addForm.active ? 'Activo' : 'Inactivo'}</span>
            </label>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => { setShowAdd(false); setAddForm(EMPTY_ADD) }}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <X size={14} /> Cancelar
            </button>
            <button
              onClick={createPlan}
              disabled={savingAdd}
              className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors disabled:opacity-50"
            >
              {savingAdd ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {savingAdd ? 'Guardando…' : 'Crear plan'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
        >
          <Plus size={15} /> Nuevo plan
        </button>
      )}

      {/* Plans list */}
      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">

        {sorted.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-neutral-500">No hay planes aún</p>
            <p className="text-xs text-neutral-400 mt-1">Crea el primer plan con el botón de arriba</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-neutral-100">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Plan</p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Precio</p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Tipo</p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Acciones</p>
            </div>

            <div className="divide-y divide-neutral-50">
              {sorted.map((plan, idx) => {
                const isEditing = editId === plan.id
                const isLoading = loadingId === plan.id
                const isDeleting = deleteId === plan.id

                return (
                  <div key={plan.id} className={`px-5 py-3.5 transition-colors ${isEditing ? 'bg-orange-50/40' : 'hover:bg-neutral-50'}`}>

                    {isEditing ? (
                      /* ── Edit row ── */
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-3">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className={input}
                            autoFocus
                          />
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                            <input
                              type="number"
                              value={editForm.price}
                              onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                              className={`${input} pl-7`}
                              min="0"
                            />
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-neutral-200 rounded-xl">
                            <button
                              type="button"
                              onClick={() => setEditForm(f => ({ ...f, is_flat: !f.is_flat }))}
                              className={`relative w-8 h-4 rounded-full transition-colors shrink-0 ${editForm.is_flat ? 'bg-orange-500' : 'bg-neutral-200'}`}
                            >
                              <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${editForm.is_flat ? 'translate-x-4' : ''}`} />
                            </button>
                            <span className="text-xs text-neutral-600">{editForm.is_flat ? 'Tarifa plana' : 'Por noche'}</span>
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditId(null)}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors"
                          >
                            <X size={12} /> Cancelar
                          </button>
                          <button
                            onClick={() => saveEdit(plan)}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── View row ── */
                      <div className="flex items-center gap-3">

                        {/* Reorder arrows */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button onClick={() => move(plan, 'up')} disabled={idx === 0 || isLoading}
                            className="p-0.5 rounded text-neutral-300 hover:text-neutral-600 disabled:opacity-20 transition-colors">
                            <ChevronUp size={13} />
                          </button>
                          <button onClick={() => move(plan, 'down')} disabled={idx === sorted.length - 1 || isLoading}
                            className="p-0.5 rounded text-neutral-300 hover:text-neutral-600 disabled:opacity-20 transition-colors">
                            <ChevronDown size={13} />
                          </button>
                        </div>

                        {/* Active indicator */}
                        <div className={`w-1.5 h-8 rounded-full shrink-0 ${plan.active ? 'bg-green-400' : 'bg-neutral-200'}`} />

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${plan.active ? 'text-neutral-900' : 'text-neutral-400'}`}>
                            {plan.name}
                          </p>
                          <p className="text-xs text-neutral-400 sm:hidden mt-0.5">
                            {fmt(plan.price)} · {plan.is_flat ? 'Tarifa plana' : 'Por noche'}
                          </p>
                        </div>

                        {/* Price — desktop */}
                        <p className="hidden sm:block text-sm font-semibold text-neutral-900 w-28 text-right shrink-0">
                          {fmt(plan.price)}
                        </p>

                        {/* Type — desktop */}
                        <div className="hidden sm:flex items-center gap-1.5 w-28 shrink-0">
                          {plan.is_flat
                            ? <><Sun size={12} className="text-amber-500" /><span className="text-xs text-neutral-500">Tarifa plana</span></>
                            : <><Moon size={12} className="text-indigo-400" /><span className="text-xs text-neutral-500">Por noche</span></>
                          }
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">

                          {/* Active toggle */}
                          <button
                            onClick={() => toggleActive(plan)}
                            disabled={isLoading}
                            title={plan.active ? 'Desactivar' : 'Activar'}
                            className={`relative w-9 h-5 rounded-full transition-colors shrink-0 disabled:opacity-50 ${plan.active ? 'bg-green-500' : 'bg-neutral-200'}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${plan.active ? 'translate-x-4' : ''}`} />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => startEdit(plan)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={13} />
                          </button>

                          {/* Delete */}
                          {isDeleting ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => deletePlan(plan.id)} disabled={isLoading}
                                className="text-[10px] font-semibold px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors">
                                {isLoading ? '…' : 'Sí'}
                              </button>
                              <button onClick={() => setDeleteId(null)}
                                className="text-[10px] font-medium px-2 py-1 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors">
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(plan.id)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-neutral-400">
        Los planes activos aparecen en el formulario de nueva reserva y en el sitio web público.
      </p>
    </div>
  )
}
