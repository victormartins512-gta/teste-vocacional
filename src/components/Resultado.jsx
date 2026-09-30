import { perfis, perguntas } from '../data/teste'
import EtapaIndicador from './EtapaIndicador'

function nomesDosPerfis(letras) {
  const nomes = letras.map((letra) => perfis[letra].nome)
  if (nomes.length === 1) return nomes[0]
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`
}

function Resultado({ resultado, onVoltarInicio }) {
  const { ranking, perfisPrincipais } = resultado
  const totalPerguntas = perguntas.length
  const perfisComplementares = ranking
    .map(([letra]) => letra)
    .filter((letra) => !perfisPrincipais.includes(letra))

  return (
    <div className="flex h-screen flex-col">
      <header className="shrink-0 border-b border-linha bg-bruma px-6 pt-6">
        <div className="mx-auto max-w-[760px]">
          <EtapaIndicador etapaAtual={4} rotulo="Resultado" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-[760px]">
          <p className="text-sm font-medium text-bussola">
            {perfisPrincipais.length > 1 ? 'Seus perfis principais' : 'Seu perfil principal'}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-estacio-dark sm:text-4xl">
            {nomesDosPerfis(perfisPrincipais)}
          </h1>

          <div className="mt-8 space-y-8">
            {perfisPrincipais.map((letra) => (
              <div key={letra} className="border-l-2 border-bussola pl-5 sm:pl-6">
                <p className="text-grafite">{perfis[letra].descricao}</p>
                <p className="mt-3 text-sm font-medium text-estacio-dark">Cursos sugeridos</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {perfis[letra].cursos.map((curso) => (
                    <span
                      key={curso}
                      className="rounded-full border border-linha bg-white px-3 py-1 text-sm text-grafite"
                    >
                      {curso}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {perfisComplementares.length > 0 && (
            <div className="mt-10 border-l-2 border-estacio-blue/30 pl-5 sm:pl-6">
              <h2 className="mb-3 font-display text-lg font-medium text-estacio-dark">
                Perfis complementares
              </h2>
              <div className="space-y-4">
                {perfisComplementares.map((letra) => (
                  <div key={letra}>
                    <p className="font-medium text-estacio-dark">{perfis[letra].nome}</p>
                    <p className="mt-1 text-sm text-grafite">{perfis[letra].descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 mb-4">
            <h2 className="mb-4 font-display text-lg font-medium text-estacio-dark">
              Sua pontuação
            </h2>
            <div className="space-y-3">
              {ranking.map(([letra, pontos]) => (
                <div key={letra} className="flex items-center gap-4">
                  <span className="w-28 shrink-0 text-sm text-grafite">{perfis[letra].nome}</span>
                  <div className="h-2 flex-1 rounded-full bg-linha">
                    <div
                      className="h-2 rounded-full bg-estacio-blue"
                      style={{ width: `${(pontos / totalPerguntas) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-sm text-grafite">{pontos}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="shrink-0 border-t border-linha bg-bruma px-6 py-4">
        <div className="mx-auto max-w-[760px]">
          <button
            type="button"
            onClick={onVoltarInicio}
            className="w-full rounded-lg bg-estacio-blue px-8 py-3.5 text-lg font-medium text-white shadow-[0_8px_24px_-8px_rgba(0,112,192,0.55)] transition-transform duration-150 hover:bg-estacio-dark active:scale-[0.98]"
          >
            Voltar ao início
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Resultado
