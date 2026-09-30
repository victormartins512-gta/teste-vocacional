// API local só para testar a gravação no Postgres da máquina antes de configurar o Supabase.
// Roda separado do Vite: `npm run dev:api`. Será removida quando o projeto migrar para o Supabase (Etapa 5).
import express from 'express'
import { Pool } from 'pg'
import { randomBytes } from 'crypto'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const config = JSON.parse(readFileSync(join(__dirname, 'local-db.config.json'), 'utf-8'))
const admin = JSON.parse(readFileSync(join(__dirname, 'local-admin.config.json'), 'utf-8'))

const pool = new Pool(config)
const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// Simula a sessão do Supabase Auth só para testar a área administrativa localmente.
// Na Etapa 5, isso é substituído por supabase.auth.signInWithPassword (ver src/lib/admin.js).
const tokensValidos = new Set()

function exigirAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !tokensValidos.has(token)) {
    return res.status(401).json({ error: 'não autenticado' })
  }
  next()
}

app.post('/admin/login', (req, res) => {
  const { email, senha } = req.body
  if (email !== admin.email || senha !== admin.senha) {
    return res.status(401).json({ error: 'e-mail ou senha inválidos' })
  }
  const token = randomBytes(24).toString('hex')
  tokensValidos.add(token)
  res.json({ token })
})

app.post('/admin/logout', exigirAdmin, (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '')
  tokensValidos.delete(token)
  res.status(204).end()
})

app.get('/admin/resultados', exigirAdmin, async (req, res) => {
  try {
    const resultado = await pool.query(`
      select
        i.id, i.nome, i.cpf, i.whatsapp, i.celular, i.email, i.curso_interesse,
        i.campus, i.turno, i.modalidade, i.criado_em as inscrito_em,
        r.perfil_principal, r.contagem, r.criado_em as teste_concluido_em
      from public.inscricoes i
      left join public.respostas_teste r on r.inscricao_id = i.id
      order by i.criado_em desc
    `)
    res.json(resultado.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.delete('/admin/inscricoes/:id', exigirAdmin, async (req, res) => {
  try {
    await pool.query('delete from public.inscricoes where id = $1', [req.params.id])
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.delete('/admin/inscricoes', exigirAdmin, async (req, res) => {
  try {
    await pool.query('delete from public.inscricoes')
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/inscricoes', async (req, res) => {
  const d = req.body
  if (!d.consentimento) {
    return res.status(400).json({ error: 'consentimento é obrigatório' })
  }
  try {
    await pool.query(
      `insert into public.inscricoes
        (id, nome, data_nascimento, cpf, whatsapp, celular, email, curso_interesse, campus, turno, modalidade, consentimento, consentimento_em)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        d.id,
        d.nome,
        d.data_nascimento,
        d.cpf,
        d.whatsapp,
        d.celular,
        d.email,
        d.curso_interesse,
        d.campus,
        d.turno,
        d.modalidade,
        d.consentimento,
        d.consentimento_em,
      ]
    )
    res.status(201).json({ ok: true })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Este CPF já está cadastrado.' })
    }
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/respostas_teste', async (req, res) => {
  const d = req.body
  try {
    await pool.query(
      `insert into public.respostas_teste (inscricao_id, respostas, contagem, perfil_principal)
       values ($1, $2, $3, $4)`,
      [d.inscricao_id, d.respostas, d.contagem, d.perfil_principal]
    )
    res.status(201).json({ ok: true })
  } catch (err) {
    if (err.code === '23503') {
      return res.status(410).json({ error: 'Sua inscrição não foi encontrada.' })
    }
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API local rodando em http://localhost:${PORT}`)
})
