import { useState } from 'react'
import BoasVindas from './components/BoasVindas'
import FichaCadastro from './components/FichaCadastro'
import TesteVocacional from './components/TesteVocacional'
import Resultado from './components/Resultado'
import AdminApp from './AdminApp'
import { salvarSessao, limparSessao, lerSessao } from './lib/armazenamentoLocal'

// Se o aluno recarregar a página no meio do teste, retoma de onde parou.
function sessaoResumivel() {
  const sessao = lerSessao()
  return sessao?.tela === 'teste' && sessao.inscricaoId ? sessao : null
}

function App() {
  const [tela, setTela] = useState(() =>
    window.location.pathname === '/admin' ? 'admin' : sessaoResumivel() ? 'teste' : 'boasVindas'
  )
  const [inscricaoId, setInscricaoId] = useState(() => sessaoResumivel()?.inscricaoId ?? null)
  const [resultado, setResultado] = useState(null)

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
          setTela('resultado')
        }}
        onReiniciar={reiniciar}
      />
    )
  }

  return <Resultado resultado={resultado} onVoltarInicio={reiniciar} />
}

export default App
