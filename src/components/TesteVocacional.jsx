import { useRef, useState } from 'react'
import { perguntas } from '../data/teste'
import BarraProgresso from './BarraProgresso'
import { calcularResultado } from '../lib/calcularResultado'
import { inserirRespostaTeste } from '../lib/db'
import {
  salvarProgressoTeste,
  lerProgressoTeste,
  limparProgressoTeste,
} from '../lib/armazenamentoLocal'

const TAMANHO_BLOCO = 5
const TOTAL_BLOCOS = Math.ceil(perguntas.length / TAMANHO_BLOCO)

function blocosDePerguntas() {
  const blocos = []
  for (let i = 0; i < perguntas.length; i += TAMANHO_BLOCO) {
    blocos.push(perguntas.slice(i, i + TAMANHO_BLOCO))
  }
  return blocos
}

const BLOCOS = blocosDePerguntas()

function opcaoClasses(selecionada, comErro) {
  const base =
    'w-full rounded-lg border px-4 py-3 text-left text-base transition focus:outline-none focus:ring-2 focus:ring-estacio-blue/40'
  if (selecionada) return `${base} border-estacio-blue bg-estacio-blue/8 text-estacio-dark`
  if (comErro) return `${base} border-red-400 text-grafite`
  return `${base} border-linha text-grafite hover:border-estacio-blue/50`
}

function TesteVocacional({ inscricaoId, onTesteFinalizado, onReiniciar }) {
  const [blocoAtual, setBlocoAtual] = useState(
    () => lerProgressoTeste(inscricaoId)?.blocoAtual ?? 0
  )
  const [respostas, setRespostas] = useState(() => lerProgressoTeste(inscricaoId)?.respostas ?? {})
  const [perguntasComErro, setPerguntasComErro] = useState(new Set())
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState('')
  const [inscricaoInvalida, setInscricaoInvalida] = useState(false)

  const areaRolavelRef = useRef(null)
  const perguntaRefs = useRef({})

  function persistir(novasRespostas, novoBloco) {
    salvarProgressoTeste(inscricaoId, { respostas: novasRespostas, blocoAtual: novoBloco })
  }

  function responder(perguntaId, valor) {
    setRespostas((anterior) => {
      const novo = { ...anterior, [perguntaId]: valor }
      persistir(novo, blocoAtual)
      return novo
    })
    setPerguntasComErro((anterior) => {
      if (!anterior.has(perguntaId)) return anterior
      const novo = new Set(anterior)
      novo.delete(perguntaId)
      return novo
    })
  }

  function rolarParaTopo() {
    areaRolavelRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function rolarParaPergunta(perguntaId) {
    perguntaRefs.current[perguntaId]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async function irParaProximoBloco() {
    const perguntasDoBloco = BLOCOS[blocoAtual]
    const faltando = perguntasDoBloco.filter((p) => !respostas[p.id]).map((p) => p.id)

    if (faltando.length > 0) {
      setPerguntasComErro(new Set(faltando))
      rolarParaPergunta(faltando[0])
      return
    }

    setPerguntasComErro(new Set())
    setErroEnvio('')

    if (blocoAtual < TOTAL_BLOCOS - 1) {
      const proximoBloco = blocoAtual + 1
      setBlocoAtual(proximoBloco)
      persistir(respostas, proximoBloco)
      rolarParaTopo()
      return
    }

    setEnviando(true)
    const resultado = calcularResultado(respostas)

    const { error, inscricaoInvalida: inscricaoNaoEncontrada } = await inserirRespostaTeste({
      inscricao_id: inscricaoId,
      respostas,
      contagem: resultado.contagem,
      perfil_principal: resultado.ranking[0][0],
    })

    setEnviando(false)

    if (inscricaoNaoEncontrada) {
      setInscricaoInvalida(true)
      return
    }

    if (error) {
      setErroEnvio('Não foi possível salvar seu resultado. Tente novamente.')
      return
    }

    limparProgressoTeste(inscricaoId)
    onTesteFinalizado(resultado)
  }

  function voltarBloco() {
    setPerguntasComErro(new Set())
    setErroEnvio('')
    setBlocoAtual((anterior) => {
      const novoBloco = Math.max(0, anterior - 1)
      persistir(respostas, novoBloco)
      return novoBloco
    })
    rolarParaTopo()
  }

  const perguntasDoBloco = BLOCOS[blocoAtual]
  const primeiraPergunta = blocoAtual * TAMANHO_BLOCO + 1
  const ultimaPergunta = primeiraPergunta + perguntasDoBloco.length - 1
  const ultimoBloco = blocoAtual === TOTAL_BLOCOS - 1

  if (inscricaoInvalida) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-estacio-dark">
          Sua inscrição não foi encontrada
        </h1>
        <p className="mt-3 text-grafite">
          Isso pode acontecer se o cadastro foi removido. Volte ao início e preencha a ficha de
          novo pra continuar.
        </p>
        <button
          type="button"
          onClick={onReiniciar}
          className="mt-8 rounded-lg bg-estacio-blue px-8 py-3 text-base font-medium text-white transition-transform duration-150 hover:bg-estacio-dark active:scale-[0.98]"
        >
          Voltar ao início
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="shrink-0 border-b border-linha bg-bruma px-6 pt-6">
        <div className="mx-auto max-w-[720px]">
          <BarraProgresso
            blocoAtual={blocoAtual + 1}
            totalBlocos={TOTAL_BLOCOS}
            perguntaInicial={primeiraPergunta}
            perguntaFinal={ultimaPergunta}
          />
        </div>
      </header>

      <div ref={areaRolavelRef} className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-[720px] space-y-10">
          {perguntasDoBloco.map((pergunta) => (
            <fieldset key={pergunta.id} ref={(el) => (perguntaRefs.current[pergunta.id] = el)}>
              <legend
                className={`mb-3 text-lg font-medium ${
                  perguntasComErro.has(pergunta.id) ? 'text-red-600' : 'text-estacio-dark'
                }`}
              >
                {pergunta.texto}
              </legend>
              <div className="space-y-2.5" role="radiogroup">
                {pergunta.opcoes.map((opcao) => (
                  <button
                    key={opcao.valor}
                    type="button"
                    role="radio"
                    aria-checked={respostas[pergunta.id] === opcao.valor}
                    onClick={() => responder(pergunta.id, opcao.valor)}
                    className={opcaoClasses(
                      respostas[pergunta.id] === opcao.valor,
                      perguntasComErro.has(pergunta.id)
                    )}
                  >
                    {opcao.texto}
                  </button>
                ))}
              </div>
              {perguntasComErro.has(pergunta.id) && (
                <p className="mt-1.5 text-sm text-red-600">Escolha uma opção para continuar.</p>
              )}
            </fieldset>
          ))}
        </div>
      </div>

      <footer className="shrink-0 border-t border-linha bg-bruma px-6 py-4">
        <div className="mx-auto max-w-[720px]">
          {erroEnvio && <p className="mb-3 text-sm text-red-600">{erroEnvio}</p>}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={voltarBloco}
              disabled={blocoAtual === 0 || enviando}
              className="rounded-lg px-6 py-3 text-base font-medium text-estacio-dark transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={irParaProximoBloco}
              disabled={enviando}
              className="rounded-lg bg-estacio-blue px-8 py-3 text-base font-medium text-white shadow-[0_8px_24px_-8px_rgba(0,112,192,0.55)] transition-transform duration-150 hover:bg-estacio-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
            >
              {enviando ? 'Salvando...' : ultimoBloco ? 'Finalizar' : 'Próximo'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TesteVocacional
