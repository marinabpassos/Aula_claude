"use client"

import { useState } from "react"
import { Check, Pencil, Plus, Trash2, X } from "lucide-react"

import type { Tarefa } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

export function PainelTarefas({
  projetoId,
  tarefasIniciais,
}: {
  projetoId: string
  tarefasIniciais: Tarefa[]
}) {
  const [tarefas, setTarefas] = useState<Tarefa[]>(tarefasIniciais)
  const [titulo, setTitulo] = useState("")
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [rascunho, setRascunho] = useState("")

  const total = tarefas.length
  const concluidas = tarefas.filter((t) => t.concluida).length

  async function adicionar(event: React.FormEvent) {
    event.preventDefault()
    if (!titulo.trim()) return
    setSalvando(true)
    setErro(null)
    const res = await fetch(`/api/projetos/${projetoId}/tarefas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    })
    setSalvando(false)
    if (!res.ok) {
      const dados = await res.json().catch(() => null)
      setErro(dados?.erro ?? "Não foi possível adicionar a tarefa.")
      return
    }
    const nova: Tarefa = await res.json()
    setTarefas((atual) => [...atual, nova])
    setTitulo("")
  }

  async function alternar(tarefa: Tarefa) {
    const concluida = !tarefa.concluida
    // Atualização otimista.
    setTarefas((atual) =>
      atual.map((t) => (t.id === tarefa.id ? { ...t, concluida } : t)),
    )
    const res = await fetch(
      `/api/projetos/${projetoId}/tarefas/${tarefa.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concluida }),
      },
    )
    if (!res.ok) {
      // Reverte em caso de erro.
      setTarefas((atual) =>
        atual.map((t) =>
          t.id === tarefa.id ? { ...t, concluida: tarefa.concluida } : t,
        ),
      )
    }
  }

  function abrirEdicao(tarefa: Tarefa) {
    setEditandoId(tarefa.id)
    setRascunho(tarefa.titulo)
    setErro(null)
  }

  async function salvarEdicao(tarefa: Tarefa) {
    const novoTitulo = rascunho.trim()
    if (!novoTitulo) {
      setErro("O título não pode ficar vazio.")
      return
    }
    if (novoTitulo === tarefa.titulo) {
      setEditandoId(null)
      return
    }
    const res = await fetch(
      `/api/projetos/${projetoId}/tarefas/${tarefa.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: novoTitulo }),
      },
    )
    if (!res.ok) {
      const dados = await res.json().catch(() => null)
      setErro(dados?.erro ?? "Não foi possível salvar a tarefa.")
      return
    }
    const atualizada: Tarefa = await res.json()
    setTarefas((atual) =>
      atual.map((t) => (t.id === tarefa.id ? atualizada : t)),
    )
    setEditandoId(null)
  }

  async function remover(tarefa: Tarefa) {
    const anterior = tarefas
    setTarefas((atual) => atual.filter((t) => t.id !== tarefa.id))
    const res = await fetch(
      `/api/projetos/${projetoId}/tarefas/${tarefa.id}`,
      { method: "DELETE" },
    )
    if (!res.ok) {
      setTarefas(anterior)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={adicionar} className="flex gap-2">
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nova tarefa..."
          maxLength={200}
        />
        <Button type="submit" disabled={salvando}>
          <Plus />
          Adicionar
        </Button>
      </form>
      {erro && <p className="text-sm text-destructive">{erro}</p>}

      <div className="text-sm text-muted-foreground">
        {total === 0
          ? "Nenhuma tarefa ainda."
          : `${concluidas} de ${total} concluídas`}
      </div>

      <ul className="flex flex-col gap-1">
        {tarefas.map((tarefa) => (
          <li
            key={tarefa.id}
            className="flex items-center gap-3 rounded-lg border px-3 py-2"
          >
            {editandoId === tarefa.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  salvarEdicao(tarefa)
                }}
                className="flex flex-1 items-center gap-2"
              >
                <Input
                  value={rascunho}
                  onChange={(e) => setRascunho(e.target.value)}
                  maxLength={200}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setEditandoId(null)
                  }}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Salvar tarefa"
                >
                  <Check />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Cancelar edição"
                  onClick={() => setEditandoId(null)}
                >
                  <X />
                </Button>
              </form>
            ) : (
              <>
                <Checkbox
                  id={`tarefa-${tarefa.id}`}
                  checked={tarefa.concluida}
                  onCheckedChange={() => alternar(tarefa)}
                />
                <label
                  htmlFor={`tarefa-${tarefa.id}`}
                  className={
                    "flex-1 cursor-pointer text-sm " +
                    (tarefa.concluida
                      ? "text-muted-foreground line-through"
                      : "")
                  }
                >
                  {tarefa.titulo}
                </label>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Editar tarefa"
                  onClick={() => abrirEdicao(tarefa)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remover tarefa"
                  onClick={() => remover(tarefa)}
                >
                  <Trash2 />
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
