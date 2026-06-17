import { NextResponse } from "next/server"

import { atualizarProjeto, obterProjeto, removerProjeto } from "@/lib/store"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const projeto = obterProjeto(id)
  if (!projeto) {
    return NextResponse.json(
      { erro: "Projeto não encontrado." },
      { status: 404 },
    )
  }
  return NextResponse.json(projeto)
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const body = await request.json().catch(() => null)

  const dados: { nome?: string; descricao?: string } = {}
  if (typeof body?.nome === "string") {
    const nome = body.nome.trim()
    if (!nome) {
      return NextResponse.json(
        { erro: "O nome não pode ficar vazio." },
        { status: 400 },
      )
    }
    dados.nome = nome
  }
  if (typeof body?.descricao === "string") {
    dados.descricao = body.descricao.trim()
  }

  const projeto = atualizarProjeto(id, dados)
  if (!projeto) {
    return NextResponse.json(
      { erro: "Projeto não encontrado." },
      { status: 404 },
    )
  }
  return NextResponse.json(projeto)
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params
  const ok = removerProjeto(id)
  if (!ok) {
    return NextResponse.json(
      { erro: "Projeto não encontrado." },
      { status: 404 },
    )
  }
  return new NextResponse(null, { status: 204 })
}
