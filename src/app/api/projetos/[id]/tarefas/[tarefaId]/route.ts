import { NextResponse } from "next/server"

import { atualizarTarefa, removerTarefa } from "@/lib/store"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ id: string; tarefaId: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const { id, tarefaId } = await params
  const body = await request.json().catch(() => null)

  const dados: { titulo?: string; concluida?: boolean } = {}
  if (typeof body?.titulo === "string") {
    const titulo = body.titulo.trim()
    if (!titulo) {
      return NextResponse.json(
        { erro: "O título não pode ficar vazio." },
        { status: 400 },
      )
    }
    dados.titulo = titulo
  }
  if (typeof body?.concluida === "boolean") {
    dados.concluida = body.concluida
  }

  const tarefa = atualizarTarefa(id, tarefaId, dados)
  if (!tarefa) {
    return NextResponse.json(
      { erro: "Tarefa ou projeto não encontrado." },
      { status: 404 },
    )
  }
  return NextResponse.json(tarefa)
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id, tarefaId } = await params
  const ok = removerTarefa(id, tarefaId)
  if (!ok) {
    return NextResponse.json(
      { erro: "Tarefa ou projeto não encontrado." },
      { status: 404 },
    )
  }
  return new NextResponse(null, { status: 204 })
}
