import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { obterProjeto } from "@/lib/store"
import { buttonVariants } from "@/components/ui/button"
import { CabecalhoProjeto } from "@/components/cabecalho-projeto"
import { PainelTarefas } from "@/components/painel-tarefas"

export const dynamic = "force-dynamic"

export default async function ProjetoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const projeto = obterProjeto(id)
  if (!projeto) notFound()

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
      <Link
        href="/"
        className={buttonVariants({ variant: "ghost", size: "sm" }) + " w-fit"}
      >
        <ArrowLeft />
        Voltar
      </Link>

      <CabecalhoProjeto
        projetoId={projeto.id}
        nomeInicial={projeto.nome}
        descricaoInicial={projeto.descricao}
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Tarefas</h2>
        <PainelTarefas
          projetoId={projeto.id}
          tarefasIniciais={projeto.tarefas}
        />
      </section>
    </main>
  )
}
