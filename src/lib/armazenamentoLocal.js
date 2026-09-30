// Centraliza as chaves do localStorage usadas para retomar o teste após recarregar a página.
const CHAVE_SESSAO = 'teste-vocacional:sessao'

export function salvarSessao(sessao) {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao))
}

export function lerSessao() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_SESSAO))
  } catch {
    return null
  }
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_SESSAO)
}

function chaveProgresso(inscricaoId) {
  return `teste-vocacional:progresso:${inscricaoId}`
}

export function salvarProgressoTeste(inscricaoId, progresso) {
  localStorage.setItem(chaveProgresso(inscricaoId), JSON.stringify(progresso))
}

export function lerProgressoTeste(inscricaoId) {
  try {
    return JSON.parse(localStorage.getItem(chaveProgresso(inscricaoId)))
  } catch {
    return null
  }
}

export function limparProgressoTeste(inscricaoId) {
  localStorage.removeItem(chaveProgresso(inscricaoId))
}
