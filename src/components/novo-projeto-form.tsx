"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function NovoProjetoForm() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!nome.trim()) {
      setErro("Dê um nome para a ideia do projeto.")
      return
    }
    setSalvando(true)
    setErro(null)
    const res = await fetch("/api/projetos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, descricao }),
    })
    setSalvando(false)
    if (!res.ok) {
      const dados = await res.json().catch(() => null)
      setErro(dados?.erro ?? "Não foi possível criar o projeto.")
      return
    }
    setNome("")
    setDescricao("")
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova ideia de projeto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: App de receitas"
              maxLength={120}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Do que se trata a ideia?"
              rows={3}
            />
          </div>
          {erro && <p className="text-sm text-destructive">{erro}</p>}
          <div>
            <Button type="submit" disabled={salvando}>
              <Plus />
              {salvando ? "Salvando..." : "Adicionar projeto"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
