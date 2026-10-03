-- Schema local (Postgres na máquina) — espelha a seção 6 da SPEC.md
-- Este mesmo SQL (menos os papéis anon/authenticator, que o Supabase já cria)
-- será rodado no SQL Editor do Supabase na Etapa 5.

-- Tabela de inscrições (ficha)
create table public.inscricoes (
  id uuid primary key,
  nome text not null,
  data_nascimento date,
  cpf text not null,
  whatsapp text not null,
  celular text not null,
  email text,
  curso_interesse text not null,
  campus text not null,
  turno text not null,
  modalidade text not null,
  consentimento boolean not null default false,
  consentimento_em timestamptz,
  criado_em timestamptz not null default now()
);

-- Tabela de respostas do teste
create table public.respostas_teste (
  id uuid primary key default gen_random_uuid(),
  inscricao_id uuid not null references public.inscricoes(id) on delete cascade,
  respostas jsonb not null,
  contagem jsonb not null,
  perfil_principal text not null,
  criado_em timestamptz not null default now()
);

create index on public.respostas_teste (inscricao_id);
create index on public.inscricoes (curso_interesse);
create index on public.inscricoes (campus);

-- Segurança: o site público só INSERE, nunca lê
alter table public.inscricoes enable row level security;
alter table public.respostas_teste enable row level security;

create policy "anon pode inserir inscricao"
  on public.inscricoes for insert to anon
  with check (consentimento = true);

create policy "anon pode inserir respostas"
  on public.respostas_teste for insert to anon
  with check (true);

-- Mesmas policies também para "authenticated": se o navegador tiver uma sessão de
-- admin ativa (por exemplo, alguém testou o /admin na mesma aba), o cadastro do
-- aluno não pode quebrar por causa disso.
create policy "authenticated pode inserir inscricao"
  on public.inscricoes for insert to authenticated
  with check (consentimento = true);

create policy "authenticated pode inserir respostas"
  on public.respostas_teste for insert to authenticated
  with check (true);

-- Área do proprietário (login via Supabase Auth): consulta e exclui.
-- Só existe um usuário admin (criado manualmente no Supabase Auth, sem cadastro
-- público), então liberar para o papel "authenticated" inteiro é seguro aqui.
-- O SELECT é necessário mesmo só usando a view pra listar: um DELETE/UPDATE com
-- filtro (ex.: id=eq.X) só "enxerga" a linha pra agir se também houver uma policy
-- de leitura na tabela base — sem isso, o filtro não encontra nada e a operação
-- silenciosamente afeta 0 linhas, sem erro.
create policy "authenticated pode ler inscricoes"
  on public.inscricoes for select to authenticated
  using (true);

create policy "authenticated pode ler respostas"
  on public.respostas_teste for select to authenticated
  using (true);

create policy "authenticated pode excluir inscricao"
  on public.inscricoes for delete to authenticated
  using (true);

create policy "authenticated pode excluir respostas"
  on public.respostas_teste for delete to authenticated
  using (true);

-- View para consulta/exportação
create view public.vw_resultados as
select
  i.nome,
  i.cpf,
  i.whatsapp,
  i.celular,
  i.email,
  i.curso_interesse,
  i.campus,
  i.turno,
  i.modalidade,
  i.criado_em as inscrito_em,
  r.perfil_principal,
  r.contagem,
  r.criado_em as teste_concluido_em,
  i.id
from public.inscricoes i
left join public.respostas_teste r on r.inscricao_id = i.id;

revoke all on public.vw_resultados from anon;
grant select on public.vw_resultados to authenticated;
