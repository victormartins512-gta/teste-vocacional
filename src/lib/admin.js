// Camada da área do proprietário. Enquanto VITE_LOCAL_API_URL estiver definida, fala com
// a API local (scripts/local-api.js), que simula uma sessão de admin. Na Etapa 6, com o
// Supabase configurado, passa a usar supabase.auth e a tabela/view reais — sem mudar quem
// chama estas funções.
import { supabase } from './supabase'

const localApiUrl = import.meta.env.VITE_LOCAL_API_URL
const CHAVE_TOKEN = 'teste-vocacional:admin-token'

function tokenLocal() {
  return sessionStorage.getItem(CHAVE_TOKEN)
}

async function fetchLocal(caminho, opcoes = {}) {
  return fetch(`${localApiUrl}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(tokenLocal() ? { Authorization: `Bearer ${tokenLocal()}` } : {}),
      ...opcoes.headers,
    },
  })
}

export async function adminLogin(email, senha) {
  if (localApiUrl) {
    const resposta = await fetchLocal('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    })
    if (!resposta.ok) {
      const corpo = await resposta.json().catch(() => ({}))
      return { error: corpo.error ?? 'Não foi possível entrar.' }
    }
    const { token } = await resposta.json()
    sessionStorage.setItem(CHAVE_TOKEN, token)
    return { error: null }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
  return { error: error ? error.message : null }
}

export async function adminLogout() {
  if (localApiUrl) {
    await fetchLocal('/admin/logout', { method: 'POST' })
    sessionStorage.removeItem(CHAVE_TOKEN)
    return
  }
  await supabase.auth.signOut()
}

export async function adminSessaoAtiva() {
  if (localApiUrl) return Boolean(tokenLocal())
  const { data } = await supabase.auth.getSession()
  return Boolean(data.session)
}

export async function adminListarResultados() {
  if (localApiUrl) {
    const resposta = await fetchLocal('/admin/resultados')
    if (!resposta.ok) return { dados: [], error: 'Não foi possível carregar os dados.' }
    return { dados: await resposta.json(), error: null }
  }
  const { data, error } = await supabase
    .from('vw_resultados')
    .select('*')
    .order('inscrito_em', { ascending: false })
  return { dados: data ?? [], error: error ? error.message : null }
}

export async function adminExcluirInscricao(id) {
  if (localApiUrl) {
    const resposta = await fetchLocal(`/admin/inscricoes/${id}`, { method: 'DELETE' })
    return { error: resposta.ok ? null : 'Não foi possível excluir.' }
  }
  const { error } = await supabase.from('inscricoes').delete().eq('id', id)
  return { error: error ? error.message : null }
}

export async function adminExcluirTudo() {
  if (localApiUrl) {
    const resposta = await fetchLocal('/admin/inscricoes', { method: 'DELETE' })
    return { error: resposta.ok ? null : 'Não foi possível excluir.' }
  }
  const { error } = await supabase.from('inscricoes').delete().gt('criado_em', '1900-01-01')
  return { error: error ? error.message : null }
}
