// Camada única de gravação. Enquanto VITE_LOCAL_API_URL estiver definida, grava na API
// local (Postgres da sua máquina). Na Etapa 5, remover VITE_LOCAL_API_URL do .env.local
// e essas mesmas funções passam a gravar direto no Supabase.
import { supabase } from './supabase'

const localApiUrl = import.meta.env.VITE_LOCAL_API_URL

async function postLocal(caminho, dados) {
  const resposta = await fetch(`${localApiUrl}${caminho}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => ({}))
    return { error: corpo.error ?? `Erro ${resposta.status}`, status: resposta.status }
  }
  return { error: null, status: resposta.status }
}

export async function inserirInscricao(dados) {
  if (localApiUrl) {
    const { error, status } = await postLocal('/inscricoes', dados)
    return { error, cpfDuplicado: status === 409 }
  }
  const { error } = await supabase.from('inscricoes').insert(dados)
  return { error: error?.message ?? null, cpfDuplicado: error?.code === '23505' }
}

export async function inserirRespostaTeste(dados) {
  if (localApiUrl) {
    const { error, status } = await postLocal('/respostas_teste', dados)
    return { error, inscricaoInvalida: status === 410 }
  }
  const { error } = await supabase.from('respostas_teste').insert(dados)
  return { error: error?.message ?? null, inscricaoInvalida: error?.code === '23503' }
}
