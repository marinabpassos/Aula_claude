import { beforeEach, describe, expect, it } from "vitest"

import {
  _resetStoreParaTestes,
  adicionarTarefa,
  atualizarProjeto,
  atualizarTarefa,
  criarProjeto,
  listarProjetos,
  obterProjeto,
  removerProjeto,
  removerTarefa,
} from "@/lib/store"

beforeEach(() => {
  _resetStoreParaTestes()
})

describe("projetos", () => {
  it("cria um projeto com valores padrão", () => {
    const p = criarProjeto("Meu app")
    expect(p.id).toBeTruthy()
    expect(p.nome).toBe("Meu app")
    expect(p.descricao).toBe("")
    expect(p.tarefas).toEqual([])
    expect(obterProjeto(p.id)).toEqual(p)
  })

  it("guarda a descrição quando informada", () => {
    const p = criarProjeto("Meu app", "uma ideia")
    expect(p.descricao).toBe("uma ideia")
  })

  it("lista projetos do mais novo para o mais antigo", () => {
    const antigo = criarProjeto("antigo")
    antigo.criadoEm = "2020-01-01T00:00:00.000Z"
    const novo = criarProjeto("novo")
    novo.criadoEm = "2030-01-01T00:00:00.000Z"

    const lista = listarProjetos()
    expect(lista.map((p) => p.nome)).toEqual(["novo", "antigo"])
  })

  it("atualiza nome e descrição", () => {
    const p = criarProjeto("nome", "desc")
    const r = atualizarProjeto(p.id, { nome: "novo", descricao: "nova" })
    expect(r?.nome).toBe("novo")
    expect(r?.descricao).toBe("nova")
  })

  it("atualiza só o campo informado", () => {
    const p = criarProjeto("nome", "desc")
    const r = atualizarProjeto(p.id, { nome: "novo" })
    expect(r?.nome).toBe("novo")
    expect(r?.descricao).toBe("desc")
  })

  it("retorna undefined ao atualizar projeto inexistente", () => {
    expect(atualizarProjeto("nao-existe", { nome: "x" })).toBeUndefined()
  })

  it("remove um projeto existente", () => {
    const p = criarProjeto("x")
    expect(removerProjeto(p.id)).toBe(true)
    expect(obterProjeto(p.id)).toBeUndefined()
  })

  it("retorna false ao remover projeto inexistente", () => {
    expect(removerProjeto("nao-existe")).toBe(false)
  })
})

describe("tarefas", () => {
  it("adiciona uma tarefa não concluída", () => {
    const p = criarProjeto("x")
    const t = adicionarTarefa(p.id, "fazer algo")
    expect(t?.titulo).toBe("fazer algo")
    expect(t?.concluida).toBe(false)
    expect(obterProjeto(p.id)?.tarefas).toHaveLength(1)
  })

  it("retorna undefined ao adicionar em projeto inexistente", () => {
    expect(adicionarTarefa("nao-existe", "x")).toBeUndefined()
  })

  it("alterna concluída e edita título", () => {
    const p = criarProjeto("x")
    const t = adicionarTarefa(p.id, "t")!
    expect(atualizarTarefa(p.id, t.id, { concluida: true })?.concluida).toBe(
      true,
    )
    expect(atualizarTarefa(p.id, t.id, { titulo: "novo" })?.titulo).toBe(
      "novo",
    )
  })

  it("retorna undefined ao atualizar tarefa em projeto inexistente", () => {
    expect(
      atualizarTarefa("nao-existe", "tid", { concluida: true }),
    ).toBeUndefined()
  })

  it("retorna undefined ao atualizar tarefa inexistente", () => {
    const p = criarProjeto("x")
    expect(
      atualizarTarefa(p.id, "nao-existe", { concluida: true }),
    ).toBeUndefined()
  })

  it("remove uma tarefa existente", () => {
    const p = criarProjeto("x")
    const t = adicionarTarefa(p.id, "t")!
    expect(removerTarefa(p.id, t.id)).toBe(true)
    expect(obterProjeto(p.id)?.tarefas).toHaveLength(0)
  })

  it("retorna false ao remover tarefa de projeto inexistente", () => {
    expect(removerTarefa("nao-existe", "tid")).toBe(false)
  })

  it("retorna false ao remover tarefa inexistente", () => {
    const p = criarProjeto("x")
    expect(removerTarefa(p.id, "nao-existe")).toBe(false)
  })
})
