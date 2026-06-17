import { beforeEach, describe, expect, it } from "vitest"

import {
  GET as listarProjetosGET,
  POST as criarProjetoPOST,
} from "@/app/api/projetos/route"
import {
  DELETE as projetoDELETE,
  GET as obterProjetoGET,
  PATCH as projetoPATCH,
} from "@/app/api/projetos/[id]/route"
import { POST as criarTarefaPOST } from "@/app/api/projetos/[id]/tarefas/route"
import {
  DELETE as tarefaDELETE,
  PATCH as tarefaPATCH,
} from "@/app/api/projetos/[id]/tarefas/[tarefaId]/route"
import {
  _resetStoreParaTestes,
  adicionarTarefa,
  criarProjeto,
} from "@/lib/store"

function req(body?: unknown, method = "POST", raw?: string) {
  return new Request("http://localhost/api", {
    method,
    headers: { "content-type": "application/json" },
    body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
  })
}

function params<T extends Record<string, string>>(p: T) {
  return { params: Promise.resolve(p) }
}

beforeEach(() => {
  _resetStoreParaTestes()
})

describe("GET/POST /api/projetos", () => {
  it("lista os projetos", async () => {
    criarProjeto("A")
    criarProjeto("B")
    const res = await listarProjetosGET()
    expect(res.status).toBe(200)
    const dados = await res.json()
    expect(dados).toHaveLength(2)
  })

  it("cria um projeto (201)", async () => {
    const res = await criarProjetoPOST(req({ nome: "Novo", descricao: "d" }))
    expect(res.status).toBe(201)
    const dados = await res.json()
    expect(dados.nome).toBe("Novo")
    expect(dados.descricao).toBe("d")
  })

  it("rejeita nome vazio (400)", async () => {
    const res = await criarProjetoPOST(req({ nome: "   " }))
    expect(res.status).toBe(400)
  })

  it("rejeita corpo inválido (400)", async () => {
    const res = await criarProjetoPOST(req(undefined, "POST", "{ invalido"))
    expect(res.status).toBe(400)
  })
})

describe("/api/projetos/[id]", () => {
  it("obtém um projeto existente", async () => {
    const p = criarProjeto("X")
    const res = await obterProjetoGET(req(undefined, "GET"), params({ id: p.id }))
    expect(res.status).toBe(200)
    expect((await res.json()).id).toBe(p.id)
  })

  it("404 ao obter inexistente", async () => {
    const res = await obterProjetoGET(
      req(undefined, "GET"),
      params({ id: "nao-existe" }),
    )
    expect(res.status).toBe(404)
  })

  it("atualiza nome e descrição", async () => {
    const p = criarProjeto("X", "d")
    const res = await projetoPATCH(
      req({ nome: "Y", descricao: "nova" }, "PATCH"),
      params({ id: p.id }),
    )
    expect(res.status).toBe(200)
    const dados = await res.json()
    expect(dados.nome).toBe("Y")
    expect(dados.descricao).toBe("nova")
  })

  it("400 ao atualizar com nome vazio", async () => {
    const p = criarProjeto("X")
    const res = await projetoPATCH(
      req({ nome: "  " }, "PATCH"),
      params({ id: p.id }),
    )
    expect(res.status).toBe(400)
  })

  it("404 ao atualizar inexistente", async () => {
    const res = await projetoPATCH(
      req({ nome: "Y" }, "PATCH"),
      params({ id: "nao-existe" }),
    )
    expect(res.status).toBe(404)
  })

  it("remove um projeto (204)", async () => {
    const p = criarProjeto("X")
    const res = await projetoDELETE(
      req(undefined, "DELETE"),
      params({ id: p.id }),
    )
    expect(res.status).toBe(204)
  })

  it("404 ao remover inexistente", async () => {
    const res = await projetoDELETE(
      req(undefined, "DELETE"),
      params({ id: "nao-existe" }),
    )
    expect(res.status).toBe(404)
  })
})

describe("POST /api/projetos/[id]/tarefas", () => {
  it("adiciona uma tarefa (201)", async () => {
    const p = criarProjeto("X")
    const res = await criarTarefaPOST(
      req({ titulo: "fazer" }),
      params({ id: p.id }),
    )
    expect(res.status).toBe(201)
    expect((await res.json()).titulo).toBe("fazer")
  })

  it("400 com título vazio", async () => {
    const p = criarProjeto("X")
    const res = await criarTarefaPOST(req({ titulo: "" }), params({ id: p.id }))
    expect(res.status).toBe(400)
  })

  it("404 em projeto inexistente", async () => {
    const res = await criarTarefaPOST(
      req({ titulo: "x" }),
      params({ id: "nao-existe" }),
    )
    expect(res.status).toBe(404)
  })
})

describe("/api/projetos/[id]/tarefas/[tarefaId]", () => {
  it("marca como concluída e edita título", async () => {
    const p = criarProjeto("X")
    const t = adicionarTarefa(p.id, "t")!

    const res1 = await tarefaPATCH(
      req({ concluida: true }, "PATCH"),
      params({ id: p.id, tarefaId: t.id }),
    )
    expect(res1.status).toBe(200)
    expect((await res1.json()).concluida).toBe(true)

    const res2 = await tarefaPATCH(
      req({ titulo: "novo" }, "PATCH"),
      params({ id: p.id, tarefaId: t.id }),
    )
    expect((await res2.json()).titulo).toBe("novo")
  })

  it("400 ao editar com título vazio", async () => {
    const p = criarProjeto("X")
    const t = adicionarTarefa(p.id, "t")!
    const res = await tarefaPATCH(
      req({ titulo: "   " }, "PATCH"),
      params({ id: p.id, tarefaId: t.id }),
    )
    expect(res.status).toBe(400)
  })

  it("404 ao editar tarefa inexistente", async () => {
    const p = criarProjeto("X")
    const res = await tarefaPATCH(
      req({ concluida: true }, "PATCH"),
      params({ id: p.id, tarefaId: "nao-existe" }),
    )
    expect(res.status).toBe(404)
  })

  it("remove uma tarefa (204)", async () => {
    const p = criarProjeto("X")
    const t = adicionarTarefa(p.id, "t")!
    const res = await tarefaDELETE(
      req(undefined, "DELETE"),
      params({ id: p.id, tarefaId: t.id }),
    )
    expect(res.status).toBe(204)
  })

  it("404 ao remover tarefa inexistente", async () => {
    const p = criarProjeto("X")
    const res = await tarefaDELETE(
      req(undefined, "DELETE"),
      params({ id: p.id, tarefaId: "nao-existe" }),
    )
    expect(res.status).toBe(404)
  })
})
