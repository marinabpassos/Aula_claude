import { NextResponse } from "next/server"

import { adicionarTarefa } from "@/lib/store"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  const titulo = typeof body?.titulo === "string" ? body.titulo.trim() : ""

  if (!titulo) {
    return NextResponse.json(
      { erro: "O título da tarefa é obrigatório." },
      { status: 400 },
    )
  }

  const tarefa = adicionarTarefa(id, titulo)
  if (!tarefa) {
    return NextResponse.json(
      { erro: "Projeto não encontrado." },
      { status: 404 },
    )
  }
  return NextResponse.json(tarefa, { status: 201 })
}
