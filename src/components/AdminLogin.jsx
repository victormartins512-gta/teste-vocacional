import { useState } from 'react'
import { adminLogin } from '../lib/admin'

function AdminLogin({ onEntrar }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setEnviando(true)

    const { error } = await adminLogin(email, senha)

    setEnviando(false)

    if (error) {
      setErro('E-mail ou senha inválidos.')
      return
    }

    onEntrar()
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-[380px] space-y-5">
        <div>
          <h1 className="font-display text-2xl font-semibold text-estacio-dark">
            Área do proprietário
          </h1>
          <p className="mt-1 text-sm text-grafite/70">
            Entre para consultar e exportar os cadastros.
          </p>
        </div>

        <div>
          <label htmlFor="admin-email" className="mb-1.5 block text-[0.9375rem] font-medium text-grafite">
            E-mail
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-linha bg-white px-3.5 py-2.5 text-base text-estacio-dark transition focus:border-estacio-blue focus:outline-none focus:ring-2 focus:ring-estacio-blue/40"
            required
          />
        </div>

        <div>
          <label htmlFor="admin-senha" className="mb-1.5 block text-[0.9375rem] font-medium text-grafite">
            Senha
          </label>
          <input
            id="admin-senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-lg border border-linha bg-white px-3.5 py-2.5 text-base text-estacio-dark transition focus:border-estacio-blue focus:outline-none focus:ring-2 focus:ring-estacio-blue/40"
            required
          />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-lg bg-estacio-blue px-8 py-3 text-base font-medium text-white transition-transform duration-150 hover:bg-estacio-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
