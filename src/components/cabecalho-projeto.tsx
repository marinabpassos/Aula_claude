"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Pencil, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CabecalhoProjeto({
  projetoId,
  nomeInicial,
  descricaoInicial,
}: {
  projetoId: string
  nomeInicial: string
  descricaoInicial: string
}) {
  const router = useRouter()
  const [nome, setNome] = useState(nomeInicial)
  const [descricao, setDescricao] = useState(descricaoInicial)
  const [editando, setEditando] = useState(false)
  const [rascunhoNome, setRascunhoNome] = useState(nomeInicial)
  const [rascunhoDescricao, setRascunhoDescricao] = useState(descricaoInicial)
  const [salvando, setSalvando] = useState(false)
  const [removendo, setRemovendo] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function abrirEdicao() {
    setRascunhoNome(nome)
    setRascunhoDescricao(descricao)
    setErro(null)
    setEditando(true)
  }

  async function salvar(event: React.FormEvent) {
    event.preventDefault()
    if (!rascunhoNome.trim()) {
      setErro("O nome não pode ficar vazio.")
      return
    }
    setSalvando(true)
    setErro(null)
    const res = await fetch(`/api/projetos/${projetoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: rascunhoNome, descricao: rascunhoDescricao }),
    })
    setSalvando(false)
    if (!res.ok) {
      const dados = await res.json().catch(() => null)
      setErro(dados?.erro ?? "Não foi possível salvar.")
      return
    }
    const atualizado = await res.json()
    setNome(atualizado.nome)
    setDescricao(atualizado.descricao)
    setEditando(false)
    router.refresh()
  }

  async function remover() {
    if (!confirm(`Excluir o projeto "${nome}"?`)) return
    setRemovendo(true)
    const res = await fetch(`/api/projetos/${projetoId}`, { method: "DELETE" })
    if (!res.ok) {
      setRemovendo(false)
      return
    }
    router.push("/")
    router.refresh()
  }

  if (editando) {
    return (
      <form onSubmit={salvar} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="editar-nome">Nome</Label>
          <Input
            id="editar-nome"
            value={rascunhoNome}
            onChange={(e) => setRascunhoNome(e.target.value)}
            maxLength={120}
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="editar-descricao">Descrição</Label>
          <Textarea
            id="editar-descricao"
            value={rascunhoDescricao}
            onChange={(e) => setRascunhoDescricao(e.target.value)}
            rows={3}
          />
        </div>
        {erro && <p className="text-sm text-destructive">{erro}</p>}
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={salvando}>
            <Check />
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEditando(false)}
            disabled={salvando}
          >
            <X />
            Cancelar
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{nome}</h1>
        {descricao && <p className="text-muted-foreground">{descricao}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="outline" size="sm" onClick={abrirEdicao}>
          <Pencil />
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={remover}
          disabled={removendo}
        >
          <Trash2 />
          Excluir
        </Button>
      </div>
    </div>
  )
}
