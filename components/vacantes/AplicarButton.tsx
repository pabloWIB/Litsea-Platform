'use client'

import { useFormStatus } from 'react-dom'

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center rounded-full bg-[#2FB7A3] px-6 py-3 text-sm font-semibold text-white ring-offset-2 transition duration-200 hover:ring-2 hover:ring-[#2FB7A3] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Enviando aplicación...' : 'Aplicar ahora'}
    </button>
  )
}

export default function AplicarButton({
  action,
}: {
  action: () => Promise<void>
}) {
  return (
    <form action={action}>
      <SubmitBtn />
    </form>
  )
}
