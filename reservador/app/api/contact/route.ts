import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, email, telefono, fechaIngreso, plan, huespedes, mensaje } = body

    if (!nombre || !email || !telefono || !plan) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 })
    }

    const lines = [
      `Nombre: ${nombre}`,
      `Email: ${email}`,
      `Teléfono: ${telefono}`,
      `Plan: ${plan}`,
      `Huéspedes: ${huespedes}`,
      fechaIngreso ? `Fecha de interés: ${fechaIngreso}` : null,
      mensaje ? `Mensaje: ${mensaje}` : null,
    ].filter(Boolean)

    const waText = encodeURIComponent(
      `Nueva consulta desde el sitio web:\n\n${lines.join("\n")}`
    )

    console.info("[contact]", { nombre, email, telefono, plan, huespedes, fechaIngreso })

    return NextResponse.json({ ok: true, waText }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Error interno." }, { status: 500 })
  }
}
