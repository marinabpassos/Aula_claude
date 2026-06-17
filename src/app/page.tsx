import { listarProjetos } from "@/lib/store"
import { NovoProjetoForm } from "@/components/novo-projeto-form"
import { ProjetoCard } from "@/components/projeto-card"

export const dynamic = "force-dynamic"

export default function Home() {
  const projetos = listarProjetos()

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-itau-azul dark:text-foreground">
          Meus side projects
        </h1>
        <p className="text-muted-foreground">
          Cadastre suas ideias e vá adicionando tarefas a cada uma.
        </p>
      </header>

      <NovoProjetoForm />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">
          Seus projetos
          <span className="ml-2 text-sm text-muted-foreground">
            ({projetos.length})
          </span>
        </h2>

        {projetos.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Nenhum projeto ainda. Crie sua primeira ideia acima.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projetos.map((projeto) => (
              <ProjetoCard key={projeto.id} projeto={projeto} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
