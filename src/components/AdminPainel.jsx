import { useEffect, useState } from 'react'
import { perfis } from '../data/teste'
import { adminListarResultados, adminExcluirInscricao, adminExcluirTudo, adminLogout } from '../lib/admin'
import { exportarCsv } from '../lib/exportarCsv'

const FRASE_CONFIRMACAO = 'EXCLUIR TUDO'

function formatarData(valor) {
  if (!valor) return '—'
  return new Date(valor).toLocaleString('pt-BR')
}

function formatarContagem(contagem) {
  if (!contagem) return '—'
  return ['A', 'B', 'C', 'D'].map((letra) => `${letra}:${contagem[letra] ?? 0}`).join(' ')
}

function nomePerfil(letra) {
  return letra ? perfis[letra]?.nome ?? letra : '—'
}

const COLUNAS_CSV = [
  { chave: 'nome', rotulo: 'Nome' },
  { chave: 'cpf', rotulo: 'CPF' },
  { chave: 'whatsapp', rotulo: 'WhatsApp' },
  { chave: 'celular', rotulo: 'Celular' },
  { chave: 'email', rotulo: 'E-mail' },
  { chave: 'curso_interesse', rotulo: 'Curso de interesse' },
  { chave: 'campus', rotulo: 'Campus' },
  { chave: 'turno', rotulo: 'Turno' },
  { chave: 'modalidade', rotulo: 'Modalidade' },
  { chave: 'inscrito_em', rotulo: 'Inscrito em', formatar: (l) => formatarData(l.inscrito_em) },
  { chave: 'perfil_principal', rotulo: 'Perfil principal', formatar: (l) => nomePerfil(l.perfil_principal) },
  { chave: 'contagem', rotulo: 'Pontuação (A/B/C/D)', formatar: (l) => formatarContagem(l.contagem) },
  {
    chave: 'teste_concluido_em',
    rotulo: 'Teste concluído em',
    formatar: (l) => formatarData(l.teste_concluido_em),
  },
]

function AdminPainel({ onSair }) {
  const [linhas, setLinhas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [excluindoId, setExcluindoId] = useState(null)
  const [confirmandoTudo, setConfirmandoTudo] = useState(false)
  const [textoConfirmacao, setTextoConfirmacao] = useState('')

  async function carregar() {
    setCarregando(true)
    const { dados, error } = await adminListarResultados()
    setLinhas(dados)
    setErro(error ?? '')
    setCarregando(false)
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleExcluir(id, nome) {
    if (!window.confirm(`Excluir ${nome}? Isso remove a ficha e o resultado do teste, sem volta.`)) {
      return
    }
    setExcluindoId(id)
    setErro('')

    const { error } = await adminExcluirInscricao(id)
    setExcluindoId(null)

    if (error) {
      setErro(`Não foi possível excluir ${nome}: ${error}`)
      return
    }

    const { dados, error: erroRecarregar } = await adminListarResultados()
    setLinhas(dados)

    if (erroRecarregar) {
      setErro(erroRecarregar)
    } else if (dados.some((linha) => linha.id === id)) {
      setErro(
        `${nome} continua cadastrado. O Supabase não permitiu a exclusão — confira a policy de DELETE em "inscricoes" no SQL Editor.`
      )
    }
  }

  async function handleExcluirTudo() {
    if (textoConfirmacao !== FRASE_CONFIRMACAO) return
    setErro('')

    const { error } = await adminExcluirTudo()
    setConfirmandoTudo(false)
    setTextoConfirmacao('')

    if (error) {
      setErro(`Não foi possível excluir os dados: ${error}`)
      return
    }

    const { dados, error: erroRecarregar } = await adminListarResultados()
    setLinhas(dados)

    if (erroRecarregar) {
      setErro(erroRecarregar)
    } else if (dados.length > 0) {
      setErro(
        'Alguns candidatos continuam cadastrados. O Supabase não permitiu excluir tudo — confira a policy de DELETE em "inscricoes" no SQL Editor.'
      )
    }
  }

  function handleExportar() {
    const dataDeHoje = new Date().toISOString().slice(0, 10)
    exportarCsv(`teste-vocacional-${dataDeHoje}.csv`, COLUNAS_CSV, linhas)
  }

  async function handleSair() {
    await adminLogout()
    onSair()
  }

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-estacio-dark">
            Área do proprietário
          </h1>
          <p className="mt-1 text-sm text-grafite/70">
            {linhas.length} {linhas.length === 1 ? 'candidato cadastrado' : 'candidatos cadastrados'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExportar}
            disabled={linhas.length === 0}
            className="rounded-lg border border-estacio-blue px-5 py-2.5 text-sm font-medium text-estacio-blue transition hover:bg-estacio-blue/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={handleSair}
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-grafite transition hover:bg-linha/50"
          >
            Sair
          </button>
        </div>
      </div>

      {erro && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>
      )}

      {carregando ? (
        <p className="text-grafite/70">Carregando...</p>
      ) : linhas.length === 0 ? (
        <p className="text-grafite/70">Nenhum candidato cadastrado ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-linha">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-linha bg-white text-grafite/70">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Curso</th>
                <th className="px-4 py-3 font-medium">Perfil</th>
                <th className="px-4 py-3 font-medium">Inscrito em</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha) => (
                <tr key={linha.id} className="border-b border-linha last:border-0">
                  <td className="px-4 py-3 text-estacio-dark">{linha.nome}</td>
                  <td className="px-4 py-3 text-grafite">{linha.curso_interesse}</td>
                  <td className="px-4 py-3 text-grafite">{nomePerfil(linha.perfil_principal)}</td>
                  <td className="px-4 py-3 text-grafite">{formatarData(linha.inscrito_em)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleExcluir(linha.id, linha.nome)}
                      disabled={excluindoId === linha.id}
                      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                    >
                      {excluindoId === linha.id ? 'Excluindo...' : 'Excluir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10 border-t border-linha pt-6">
        {!confirmandoTudo ? (
          <button
            type="button"
            onClick={() => setConfirmandoTudo(true)}
            disabled={linhas.length === 0}
            className="text-sm font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
          >
            Excluir todos os dados
          </button>
        ) : (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-700">
              Isso apaga <strong>todos</strong> os {linhas.length} candidatos e seus resultados,
              sem volta. Digite <strong>{FRASE_CONFIRMACAO}</strong> para confirmar.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <input
                type="text"
                value={textoConfirmacao}
                onChange={(e) => setTextoConfirmacao(e.target.value)}
                className="rounded-lg border border-red-300 bg-white px-3.5 py-2 text-base text-estacio-dark focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                type="button"
                onClick={handleExcluirTudo}
                disabled={textoConfirmacao !== FRASE_CONFIRMACAO}
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirmar exclusão
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmandoTudo(false)
                  setTextoConfirmacao('')
                }}
                className="rounded-lg px-5 py-2 text-sm font-medium text-grafite hover:bg-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPainel
