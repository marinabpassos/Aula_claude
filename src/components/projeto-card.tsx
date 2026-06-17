"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Trash2 } from "lucide-react"

import type { Projeto } from "@/lib/types"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ProjetoCard({ projeto }: { projeto: Projeto }) {
  const router = useRouter()
  const [removendo, setRemovendo] = useState(false)

  const total = projeto.tarefas.length
  const concluidas = projeto.tarefas.filter((t) => t.concluida).length

  async function remover() {
    if (!confirm(`Excluir o projeto "${projeto.nome}"?`)) return
    setRemovendo(true)
    const res = await fetch(`/api/projetos/${projeto.id}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      setRemovendo(false)
      return
    }
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{projeto.nome}</CardTitle>
        {projeto.descricao && (
          <CardDescription>{projeto.descricao}</CardDescription>
        )}
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Excluir projeto"
            onClick={remover}
            disabled={removendo}
          >
            <Trash2 />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {total === 0
          ? "Nenhuma tarefa ainda"
          : `${concluidas}/${total} concluídas`}
      </CardContent>
      <CardFooter>
        <Link
          href={`/projetos/${projeto.id}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Abrir
          <ArrowRight />
        </Link>
      </CardFooter>
    </Card>
  )
}
