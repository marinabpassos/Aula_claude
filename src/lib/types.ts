export type Tarefa = {
  id: string
  titulo: string
  concluida: boolean
  criadoEm: string
}

export type Projeto = {
  id: string
  nome: string
  descricao: string
  criadoEm: string
  tarefas: Tarefa[]
}
