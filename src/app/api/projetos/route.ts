import { NextResponse } from "next/server"

import { criarProjeto, listarProjetos } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(listarProjetos())
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const nome = typeof body?.nome === "string" ? body.nome.trim() : ""
  const descricao =
    typeof body?.descricao === "string" ? body.descricao.trim() : ""

  if (!nome) {
    return NextResponse.json(
      { erro: "O nome do projeto é obrigatório." },
      { status: 400 },
    )
  }

  const projeto = criarProjeto(nome, descricao)
  return NextResponse.json(projeto, { status: 201 })
}
