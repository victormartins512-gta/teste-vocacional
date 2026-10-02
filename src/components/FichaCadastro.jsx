import { useState } from 'react'
import { inserirInscricao } from '../lib/db'
import { cursosPresenciais, cursosSemipresenciais } from '../data/cursos'
import EtapaIndicador from './EtapaIndicador'
import {
  mascararData,
  validarData,
  mascararCPF,
  mascararTelefone,
  validarTelefone,
  validarEmail,
  validarNomeCompleto,
} from '../lib/validacao'

const TURNOS = ['Manhã', 'Tarde', 'Noite']
const MODALIDADES = ['Presencial', 'Semipresencial', 'Ao Vivo', 'Flex', 'EAD']

const CAMPOS_INICIAIS = {
  nome: '',
  data_nascimento: '',
  cpf: '',
  whatsapp: '',
  celular: '',
  email: '',
  curso_interesse: '',
  campus: '',
  turno: '',
  modalidade: '',
  consentimento: false,
}

function inputClasses(comErro) {
  const base =
    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-base text-estacio-dark transition focus:outline-none focus:ring-2 focus:ring-estacio-blue/40 focus:border-estacio-blue'
  return comErro ? `${base} border-red-400` : `${base} border-linha`
}

function Secao({ titulo, children }) {
  return (
    <div className="border-l-2 border-estacio-blue/30 pl-5 sm:pl-6">
      <h2 className="mb-4 font-display text-lg font-medium text-estacio-dark">{titulo}</h2>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

function Campo({ label, erro, children }) {
  return (
    <div>
      {label}
      {children}
      {erro && <p className="mt-1.5 text-sm text-red-600">{erro}</p>}
    </div>
  )
}

function FichaCadastro({ onFichaSalva }) {
  const [campos, setCampos] = useState(CAMPOS_INICIAIS)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState('')

  function atualizarCampo(nome, valor) {
    setCampos((anterior) => ({ ...anterior, [nome]: valor }))
  }

  function validarCampos() {
    const novosErros = {}

    if (!validarNomeCompleto(campos.nome)) {
      novosErros.nome = 'Informe o nome completo (mínimo 2 palavras).'
    }
    if (campos.data_nascimento && !validarData(campos.data_nascimento)) {
      novosErros.data_nascimento = 'Informe uma data válida (DD/MM/AAAA).'
    }
    if (!validarTelefone(campos.whatsapp)) {
      novosErros.whatsapp = 'Informe um WhatsApp válido com DDD.'
    }
    if (!validarTelefone(campos.celular)) {
      novosErros.celular = 'Informe um celular válido com DDD.'
    }
    if (campos.email && !validarEmail(campos.email)) {
      novosErros.email = 'Informe um e-mail válido.'
    }
    if (!campos.curso_interesse) {
      novosErros.curso_interesse = 'Selecione o curso de interesse.'
    }
    if (!campos.campus.trim()) {
      novosErros.campus = 'Informe o campus.'
    }
    if (!campos.turno) {
      novosErros.turno = 'Selecione o turno.'
    }
    if (!campos.modalidade) {
      novosErros.modalidade = 'Selecione a modalidade.'
    }
    if (!campos.consentimento) {
      novosErros.consentimento = 'É necessário autorizar o uso dos dados para continuar.'
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErroEnvio('')

    if (!validarCampos()) return

    setEnviando(true)

    const id = crypto.randomUUID()
    const agora = new Date().toISOString()

    const { error } = await inserirInscricao({
      id,
      nome: campos.nome.trim(),
      data_nascimento: validarData(campos.data_nascimento),
      cpf: campos.cpf || null,
      whatsapp: campos.whatsapp,
      celular: campos.celular,
      email: campos.email.trim() || null,
      curso_interesse: campos.curso_interesse,
      campus: campos.campus.trim(),
      turno: campos.turno,
      modalidade: campos.modalidade,
      consentimento: true,
      consentimento_em: agora,
    })

    setEnviando(false)

    if (error) {
      setErroEnvio('Não foi possível salvar sua ficha. Verifique os dados e tente novamente.')
      return
    }

    onFichaSalva(id)
  }

  const rotuloLabel = 'mb-1.5 block text-[0.9375rem] font-medium text-grafite'

  return (
    <form onSubmit={handleSubmit} className="flex h-screen flex-col">
      <header className="shrink-0 border-b border-linha bg-bruma px-6 pt-6">
        <div className="mx-auto max-w-[760px]">
          <EtapaIndicador etapaAtual={2} rotulo="Ficha de cadastro" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-[760px] space-y-10">
          <div>
            <h1 className="mb-1 font-display text-3xl font-semibold text-estacio-dark">
              Ficha de cadastro
            </h1>
            <p className="text-grafite/80">Preencha seus dados para liberar o teste vocacional.</p>
          </div>

          <Secao titulo="Dados pessoais">
          <Campo
            label={
              <label htmlFor="nome" className={rotuloLabel}>
                Nome completo do candidato
              </label>
            }
            erro={erros.nome}
          >
            <input
              id="nome"
              type="text"
              value={campos.nome}
              onChange={(e) => atualizarCampo('nome', e.target.value)}
              className={inputClasses(erros.nome)}
            />
          </Campo>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Campo
              label={
                <label htmlFor="data_nascimento" className={rotuloLabel}>
                  Data de nascimento <span className="text-grafite/50">(opcional)</span>
                </label>
              }
              erro={erros.data_nascimento}
            >
              <input
                id="data_nascimento"
                type="text"
                placeholder="DD/MM/AAAA"
                value={campos.data_nascimento}
                onChange={(e) => atualizarCampo('data_nascimento', mascararData(e.target.value))}
                className={inputClasses(erros.data_nascimento)}
              />
            </Campo>

            <Campo
              label={
                <label htmlFor="cpf" className={rotuloLabel}>
                  CPF <span className="text-grafite/50">(opcional)</span>
                </label>
              }
              erro={erros.cpf}
            >
              <input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={campos.cpf}
                onChange={(e) => atualizarCampo('cpf', mascararCPF(e.target.value))}
                className={inputClasses(erros.cpf)}
              />
            </Campo>
          </div>
        </Secao>

        <Secao titulo="Contato">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Campo
              label={
                <label htmlFor="whatsapp" className={rotuloLabel}>
                  WhatsApp (com DDD)
                </label>
              }
              erro={erros.whatsapp}
            >
              <input
                id="whatsapp"
                type="text"
                placeholder="(99) 99999-9999"
                value={campos.whatsapp}
                onChange={(e) => atualizarCampo('whatsapp', mascararTelefone(e.target.value))}
                className={inputClasses(erros.whatsapp)}
              />
            </Campo>

            <Campo
              label={
                <label htmlFor="celular" className={rotuloLabel}>
                  Celular (com DDD)
                </label>
              }
              erro={erros.celular}
            >
              <input
                id="celular"
                type="text"
                placeholder="(99) 99999-9999"
                value={campos.celular}
                onChange={(e) => atualizarCampo('celular', mascararTelefone(e.target.value))}
                className={inputClasses(erros.celular)}
              />
            </Campo>
          </div>

          <Campo
            label={
              <label htmlFor="email" className={rotuloLabel}>
                E-mail <span className="text-grafite/50">(opcional)</span>
              </label>
            }
            erro={erros.email}
          >
            <input
              id="email"
              type="email"
              value={campos.email}
              onChange={(e) => atualizarCampo('email', e.target.value)}
              className={inputClasses(erros.email)}
            />
          </Campo>
        </Secao>

        <Secao titulo="Curso desejado">
          <Campo
            label={
              <label htmlFor="curso_interesse" className={rotuloLabel}>
                Curso de interesse
              </label>
            }
            erro={erros.curso_interesse}
          >
            <select
              id="curso_interesse"
              value={campos.curso_interesse}
              onChange={(e) => atualizarCampo('curso_interesse', e.target.value)}
              className={inputClasses(erros.curso_interesse)}
            >
              <option value="">Selecione um curso</option>
              <optgroup label="Presenciais">
                {cursosPresenciais.map((curso) => (
                  <option key={curso} value={curso}>
                    {curso}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Semipresenciais">
                {cursosSemipresenciais.map((curso) => (
                  <option key={curso} value={curso}>
                    {curso}
                  </option>
                ))}
              </optgroup>
            </select>
          </Campo>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Campo
              label={
                <label htmlFor="campus" className={rotuloLabel}>
                  Campus
                </label>
              }
              erro={erros.campus}
            >
              <input
                id="campus"
                type="text"
                value={campos.campus}
                onChange={(e) => atualizarCampo('campus', e.target.value)}
                className={inputClasses(erros.campus)}
              />
            </Campo>

            <Campo
              label={
                <label htmlFor="turno" className={rotuloLabel}>
                  Turno
                </label>
              }
              erro={erros.turno}
            >
              <select
                id="turno"
                value={campos.turno}
                onChange={(e) => atualizarCampo('turno', e.target.value)}
                className={inputClasses(erros.turno)}
              >
                <option value="">Selecione</option>
                {TURNOS.map((turno) => (
                  <option key={turno} value={turno}>
                    {turno}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo
              label={
                <label htmlFor="modalidade" className={rotuloLabel}>
                  Modalidade
                </label>
              }
              erro={erros.modalidade}
            >
              <select
                id="modalidade"
                value={campos.modalidade}
                onChange={(e) => atualizarCampo('modalidade', e.target.value)}
                className={inputClasses(erros.modalidade)}
              >
                <option value="">Selecione</option>
                {MODALIDADES.map((modalidade) => (
                  <option key={modalidade} value={modalidade}>
                    {modalidade}
                  </option>
                ))}
              </select>
            </Campo>
          </div>
        </Secao>

        <Secao titulo="Autorização">
          <Campo erro={erros.consentimento}>
            <label className="flex items-start gap-3 text-[0.9375rem] leading-snug text-grafite">
              <input
                type="checkbox"
                checked={campos.consentimento}
                onChange={(e) => atualizarCampo('consentimento', e.target.checked)}
                className="mt-1 h-4 w-4 accent-estacio-blue"
              />
              <span>
                Autorizo o uso dos meus dados para contato sobre o resultado do teste vocacional
                e sobre cursos da Estácio, conforme a Lei Geral de Proteção de Dados (LGPD).
              </span>
            </label>
          </Campo>
          </Secao>
        </div>
      </div>

      <footer className="shrink-0 border-t border-linha bg-bruma px-6 py-4">
        <div className="mx-auto max-w-[760px]">
          {erroEnvio && (
            <div className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {erroEnvio}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-estacio-blue px-8 py-3.5 text-lg font-medium text-white shadow-[0_8px_24px_-8px_rgba(0,112,192,0.55)] transition-transform duration-150 hover:bg-estacio-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
          >
            {enviando ? 'Salvando...' : 'Começar teste'}
          </button>
        </div>
      </footer>
    </form>
  )
}

export default FichaCadastro
