import type { Projeto, Tarefa } from "@/lib/types"

// Store em memória. Os dados vivem só enquanto o servidor estiver rodando
// (sem banco, como pedido). Guardamos no globalThis para sobreviver ao
// hot-reload do `next dev`, evitando que o estado zere a cada alteração.
type Store = Map<string, Projeto>

const globalForStore = globalThis as unknown as {
  __projetosStore?: Store
}

function getStore(): Store {
  if (!globalForStore.__projetosStore) {
    const store: Store = new Map()
    // Projeto de exemplo para a tela não nascer vazia.
    const id = crypto.randomUUID()
    store.set(id, {
      id,
      nome: "Meu primeiro side project",
      descricao: "Edite ou apague — é só um exemplo para começar.",
      criadoEm: new Date().toISOString(),
      tarefas: [
        {
          id: crypto.randomUUID(),
          titulo: "Definir a ideia",
          concluida: true,
          criadoEm: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          titulo: "Listar as primeiras tarefas",
          concluida: false,
          criadoEm: new Date().toISOString(),
        },
      ],
    })
    globalForStore.__projetosStore = store
  }
  return globalForStore.__projetosStore
}

export function listarProjetos(): Projeto[] {
  return [...getStore().values()].sort((a, b) =>
    b.criadoEm.localeCompare(a.criadoEm),
  )
}

export function obterProjeto(id: string): Projeto | undefined {
  return getStore().get(id)
}

export function criarProjeto(nome: string, descricao = ""): Projeto {
  const projeto: Projeto = {
    id: crypto.randomUUID(),
    nome,
    descricao,
    criadoEm: new Date().toISOString(),
    tarefas: [],
  }
  getStore().set(projeto.id, projeto)
  return projeto
}

export function atualizarProjeto(
  id: string,
  dados: Partial<Pick<Projeto, "nome" | "descricao">>,
): Projeto | undefined {
  const projeto = getStore().get(id)
  if (!projeto) return undefined
  if (dados.nome !== undefined) projeto.nome = dados.nome
  if (dados.descricao !== undefined) projeto.descricao = dados.descricao
  return projeto
}

export function removerProjeto(id: string): boolean {
  return getStore().delete(id)
}

export function adicionarTarefa(
  projetoId: string,
  titulo: string,
): Tarefa | undefined {
  const projeto = getStore().get(projetoId)
  if (!projeto) return undefined
  const tarefa: Tarefa = {
    id: crypto.randomUUID(),
    titulo,
    concluida: false,
    criadoEm: new Date().toISOString(),
  }
  projeto.tarefas.push(tarefa)
  return tarefa
}

export function atualizarTarefa(
  projetoId: string,
  tarefaId: string,
  dados: Partial<Pick<Tarefa, "titulo" | "concluida">>,
): Tarefa | undefined {
  const projeto = getStore().get(projetoId)
  if (!projeto) return undefined
  const tarefa = projeto.tarefas.find((t) => t.id === tarefaId)
  if (!tarefa) return undefined
  if (dados.titulo !== undefined) tarefa.titulo = dados.titulo
  if (dados.concluida !== undefined) tarefa.concluida = dados.concluida
  return tarefa
}

export function removerTarefa(projetoId: string, tarefaId: string): boolean {
  const projeto = getStore().get(projetoId)
  if (!projeto) return false
  const antes = projeto.tarefas.length
  projeto.tarefas = projeto.tarefas.filter((t) => t.id !== tarefaId)
  return projeto.tarefas.length < antes
}
