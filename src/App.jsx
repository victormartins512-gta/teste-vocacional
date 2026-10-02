import { useState } from 'react'
import BoasVindas from './components/BoasVindas'
import FichaCadastro from './components/FichaCadastro'
import TesteVocacional from './components/TesteVocacional'
import Resultado from './components/Resultado'
import AdminApp from './AdminApp'
import { salvarSessao, limparSessao, lerSessao } from './lib/armazenamentoLocal'

// Se o aluno recarregar a página no meio do teste (ou já na tela de resultado), retoma de onde parou.
function sessaoResumivel() {
  const sessao = lerSessao()
  if (sessao?.tela === 'teste' && sessao.inscricaoId) return sessao
  if (sessao?.tela === 'resultado' && sessao.resultado) return sessao
  return null
}

function App() {
  const [tela, setTela] = useState(() => {
    if (window.location.pathname === '/admin') return 'admin'
    return sessaoResumivel()?.tela ?? 'boasVindas'
  })
  const [inscricaoId, setInscricaoId] = useState(() => sessaoResumivel()?.inscricaoId ?? null)
  const [resultado, setResultado] = useState(() => sessaoResumivel()?.resultado ?? null)

  function reiniciar() {
    limparSessao()
    setInscricaoId(null)
    setResultado(null)
    setTela('boasVindas')
  }

  if (tela === 'admin') {
    return <AdminApp />
  }

  if (tela === 'boasVindas') {
    return <BoasVindas onComecar={() => setTela('ficha')} />
  }

  if (tela === 'ficha') {
    return (
      <FichaCadastro
        onFichaSalva={(id) => {
          setInscricaoId(id)
          salvarSessao({ tela: 'teste', inscricaoId: id })
          setTela('teste')
        }}
      />
    )
  }

  if (tela === 'teste') {
    return (
      <TesteVocacional
        inscricaoId={inscricaoId}
        onTesteFinalizado={(resultadoCalculado) => {
          setResultado(resultadoCalculado)
          salvarSessao({ tela: 'resultado', resultado: resultadoCalculado })
          setTela('resultado')
        }}
        onReiniciar={reiniciar}
      />
    )
  }

  return <Resultado resultado={resultado} onVoltarInicio={reiniciar} />
}

export default App
