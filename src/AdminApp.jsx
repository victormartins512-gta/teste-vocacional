import { useEffect, useState } from 'react'
import AdminLogin from './components/AdminLogin'
import AdminPainel from './components/AdminPainel'
import { adminSessaoAtiva } from './lib/admin'

function AdminApp() {
  const [verificando, setVerificando] = useState(true)
  const [logado, setLogado] = useState(false)

  useEffect(() => {
    adminSessaoAtiva().then((ativa) => {
      setLogado(ativa)
      setVerificando(false)
    })
  }, [])

  if (verificando) return null

  if (!logado) {
    return <AdminLogin onEntrar={() => setLogado(true)} />
  }

  return <AdminPainel onSair={() => setLogado(false)} />
}

export default AdminApp
