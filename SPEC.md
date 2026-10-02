# Teste Vocacional Online — Especificação para o Claude Code

## 0. Instruções para o Claude Code

- Trabalhe **por etapas** (seção 9). Ao final de cada etapa, **pare**, mostre o que foi feito e me diga como testar. Só siga para a próxima quando eu confirmar.
- Idioma de toda a interface: **português do Brasil**.
- Não invente campos nem perguntas: use exatamente o que está nas seções 4 e 5.
- Ambiente: Windows + VS Code. Comandos de terminal devem funcionar no PowerShell.

---

## 1. Objetivo

Página web onde o aluno do ensino médio:
1. Preenche a **ficha de cadastro do candidato** (dados pessoais).
2. Só depois de salvar a ficha, acessa o **teste vocacional**.
3. Ao terminar, vê o **resultado**. Ficha, respostas e resultado ficam armazenados no Supabase.

Regra principal: **a ficha é salva no banco no momento em que o aluno clica em "Começar teste"**, antes do teste. Quem abandonar o teste continua cadastrado.

Foco desta versão: **desktop** (layout pensado para telas ≥ 1024px). Não precisa ser perfeito no celular agora, mas não pode quebrar.

---

## 2. Stack

| Camada | Tecnologia |
|---|---|
| Front | React + Vite (JavaScript) |
| Estilo | Tailwind CSS |
| Banco | Supabase (Postgres) via `@supabase/supabase-js` |
| Hospedagem | Vercel |

Variáveis de ambiente (arquivo `.env.local`, **não** commitar):

```
VITE_SUPABASE_URL=https://XXXX.supabase.co
VITE_SUPABASE_ANON_KEY=chave_publica_anon
```

Criar também um `.env.example` com as mesmas chaves vazias.

---

## 3. Fluxo de telas

```
[Tela 1: Boas-vindas] → [Tela 2: Ficha] → salva no banco → [Tela 3: Teste] → salva respostas → [Tela 4: Resultado]
```

**Tela 1: Boas-vindas**
- Logo da Estácio Castanhal no topo (`public/logo.png`, fornecido depois).
- Título "Teste Vocacional", texto curto explicando o que é e o tempo estimado (~10 minutos).
- Botão "Quero começar".

**Tela 2: Ficha de cadastro**
- Título "Ficha de Cadastro do Candidato" com visual no estilo da ficha oficial (seção 4).
- Campos da seção 4.1, com validação antes de enviar.
- Checkbox obrigatório de consentimento LGPD (texto na seção 4.2).
- Botão "Começar teste": gera o `id` (UUID) no front com `crypto.randomUUID()`, faz o insert em `inscricoes` e avança.
- Se o insert falhar: mensagem clara de erro, sem avançar e sem perder o que foi digitado.

**Tela 3: Teste vocacional**
- Mostrar **5 perguntas por bloco** com botões "Voltar" e "Próximo".
- Barra de progresso no topo (ex.: "Bloco 2 de 4 · Perguntas 6–10").
- Não deixa avançar o bloco com pergunta sem resposta (destacar em vermelho as que faltam).
- Salvar progresso no `localStorage` (id da inscrição + respostas). Se o aluno recarregar a página, retoma de onde parou.
- Ao finalizar: calcula o resultado (regra da seção 5.3), faz o insert em `respostas_teste` e avança.

**Tela 4: Resultado**
- Exibe o perfil principal (maior pontuação) e os perfis complementares.
- Mostra o nome do perfil, descrição, pontuação e sugestões de cursos (seção 5.4).
- Exibe também a tabela de pontuação completa: A | B | C | D (igual ao rodapé da folha do teste).
- Botão "Voltar ao início": limpa o `localStorage` e volta para a Tela 1. Útil em laboratórios de escola.

**Tela 5: Área do proprietário** (rota `/admin`, fora do fluxo do aluno)
- Login com e-mail/senha via Supabase Auth. Sem cadastro público — o usuário é criado manualmente no painel do Supabase.
- Depois de logado: tabela com todos os candidatos (ficha + resultado, equivalente à `vw_resultados`).
- Botão "Exportar CSV": baixa um arquivo com todas as colunas da tabela.
- Excluir candidato individual (ficha + resultado juntos, via cascade).
- Excluir todos os dados de uma vez, com confirmação explícita (ação irreversível).

---

## 4. Ficha de cadastro do candidato

### 4.1 Campos

| Campo | Coluna no banco | Tipo | Obrigatório | Observação |
|---|---|---|---|---|
| Nome completo do candidato | `nome` | text | sim | Mínimo 2 palavras |
| Data de nascimento | `data_nascimento` | date | não | Formato DD/MM/AAAA com máscara; se preenchida, precisa ser válida |
| CPF | `cpf` | text | não | Máscara 000.000.000-00, sem validação de dígitos nem exigência de ser único |
| WhatsApp (com DDD) | `whatsapp` | text | sim | Máscara (99) 99999-9999 |
| Celular (com DDD) | `celular` | text | sim | Máscara (99) 99999-9999 |
| E-mail | `email` | text | não | Validação de formato; se preenchido, precisa ser válido |
| Curso de interesse | `curso_interesse` | text | sim | Select — lista da seção 4.3 |
| Campus | `campus` | text | sim | Campo texto livre |
| Turno | `turno` | text | sim | Select: Manhã / Tarde / Noite |
| Modalidade | `modalidade` | text | sim | Select: Presencial / Semipresencial / Ao Vivo / Flex / EAD |

> **Não há campo de "escola" ou "série" na ficha oficial.** Não adicionar.

### 4.2 Consentimento LGPD (obrigatório)

Checkbox:
> "Autorizo o uso dos meus dados para contato sobre o resultado do teste vocacional e sobre cursos da Estácio, conforme a Lei Geral de Proteção de Dados (LGPD)."

Salvar `consentimento = true` e `consentimento_em = now()`.

### 4.3 Lista de cursos para o select

Renderizar em dois grupos dentro do `<select>`:

**Presenciais**
- Administração
- Análise e Des. de Sistemas
- Biomedicina
- Ciências Contábeis
- Direito
- Enfermagem
- Engenharia Civil
- Farmácia
- Fisioterapia
- Psicologia
- Odontologia

**Semipresenciais**
- Administração (Semipresencial)
- Análise e Des. de Sistemas (Semipresencial)
- Biomedicina (Semipresencial)
- Ciências Contábeis (Semipresencial)
- Ed. Física - Bacharelado
- Enfermagem (Semipresencial)
- Engenharia Civil (Semipresencial)
- Farmácia (Semipresencial)
- Fisioterapia (Semipresencial)
- Nutrição
- Medicina Veterinária
- Terapia Ocupacional
- Fonoaudiologia
- Pedagogia

---

## 5. Teste vocacional

### 5.1 Estrutura do arquivo de dados

As perguntas ficam em `src/data/teste.js` (não no banco):

```js
export const perfis = {
  A: {
    nome: "Perfil Executor",
    descricao: "...",
    cursos: ["Administração", "Engenharia Civil", "Educação Física", ...]
  },
  B: { ... },
  C: { ... },
  D: { ... },
};

export const perguntas = [
  {
    id: 1,
    texto: "Quando você precisa aprender algo novo, prefere:",
    opcoes: [
      { valor: "A", texto: "Colocar em prática logo, mesmo sem saber tudo" },
      { valor: "B", texto: "Seguir um passo a passo estruturado" },
      { valor: "C", texto: "Conversar com pessoas e aprender de forma colaborativa" },
      { valor: "D", texto: "Investigar a fundo, entender teorias e questionar" },
    ],
  },
  // ... demais perguntas
];
```

Cada opção **não** carrega `area` no objeto — o mapeamento é simples: A → Perfil A, B → Perfil B, C → Perfil C, D → Perfil D (ver seção 5.3).

### 5.2 Perguntas completas

```
1. Quando você precisa aprender algo novo, prefere:
   a) Colocar em prática logo, mesmo sem saber tudo
   b) Seguir um passo a passo estruturado
   c) Conversar com pessoas e aprender de forma colaborativa
   d) Investigar a fundo, entender teorias e questionar

2. No trabalho ideal, você gostaria de ter:
   a) Desafios constantes, sem rotina fixa
   b) Estabilidade, clareza de funções e metas definidas
   c) Contato humano e propósito social
   d) Autonomia intelectual e liberdade para criar soluções

3. Quando surge um problema inesperado, sua reação é:
   a) Agir rápido e improvisar até resolver
   b) Usar experiências passadas e seguir padrões conhecidos
   c) Ouvir diferentes pontos de vista antes de agir
   d) Analisar o problema em profundidade antes de decidir

4. Em um grupo de trabalho, você costuma ser quem:
   a) Toma a frente e coloca todos em movimento
   b) Organiza processos, recursos e prazos
   c) Motiva e cuida da integração das pessoas
   d) Questiona, propõe novas ideias e soluções

5. Você se sente mais motivado quando:
   a) Tem metas desafiadoras e obstáculos para superar
   b) Conquista segurança e reconhecimento pelo esforço constante
   c) Vê impacto positivo do seu trabalho em outras pessoas
   d) Consegue transformar ideias em algo útil e inovador

6. Você se sente mais satisfeito quando:
   a) Supera obstáculos e prova sua capacidade
   b) Cumpre o que se comprometeu e entrega resultados
   c) Ajuda alguém a alcançar algo importante
   d) Encontra soluções que ninguém havia pensado

7. Em ambientes de pressão, você costuma:
   a) Tomar a frente e agir sem demora
   b) Seguir processos e manter disciplina
   c) Apoiar os outros e buscar cooperação
   d) Analisar rapidamente para achar a melhor saída

8. Você gosta de ambientes que oferecem:
   a) Adrenalina, movimento e desafios constantes
   b) Estrutura, segurança e regras claras
   c) Colaboração, diversidade e troca de ideias
   d) Autonomia, pesquisa e espaço para criar

9. Para você, trabalhar em equipe significa:
   a) Colocar todos em ação rumo ao objetivo
   b) Garantir que cada um cumpra sua parte
   c) Manter boas relações e motivar o grupo
   d) Pensar juntos em soluções inovadoras

10. Uma frase que se aproxima mais de você é:
    a) "Prefiro arriscar e aprender fazendo"
    b) "Disciplina e foco trazem resultados"
    c) "As pessoas são o que mais importa"
    d) "Tudo pode ser entendido, melhorado ou reinventado"

11. Para você, sucesso profissional significa:
    a) Ser referência prática, admirado pela performance
    b) Alcançar estabilidade financeira e posição sólida
    c) Contribuir para a sociedade e ser respeitado pelo caráter
    d) Criar algo novo, ser inovador ou especialista reconhecido

12. Em uma liderança, você prefere:
    a) Liderar em momentos críticos, mostrando atitude
    b) Ter controle do processo do início ao fim
    c) Inspirar, unir talentos e criar engajamento
    d) Usar estratégia, análise e visão de longo prazo

13. Em termos de aprendizado, você se conecta mais com:
    a) Experiências práticas, testes e desafios físicos
    b) Métodos organizados, métricas e treinamentos formais
    c) Histórias, culturas, debates e trocas humanas
    d) Matemática, lógica, tecnologia e inovação

14. Quando pensa no futuro, você sonha em:
    a) Ser excelente na sua profissão, alguém prático e reconhecido
    b) Crescer passo a passo, ocupando cargos estáveis
    c) Deixar impacto positivo e transformar vidas
    d) Desvendar problemas complexos e criar soluções únicas

15. Você é mais eficiente quando:
    a) Precisa reagir e agir rapidamente
    b) Tem uma rotina organizada e previsível
    c) Está cercado de pessoas engajadas
    d) Precisa resolver enigmas ou problemas desafiadores

16. Quando recebe elogios, o que mais valoriza é:
    a) Sua coragem, energia ou iniciativa
    b) Sua responsabilidade, organização e dedicação
    c) Sua empatia, ética ou capacidade de inspirar
    d) Sua inteligência, visão ou criatividade

17. Ao iniciar um novo projeto, você tende a:
    a) Entrar com tudo e aprender no caminho
    b) Planejar bem cada etapa antes de começar
    c) Motivar a equipe e criar harmonia
    d) Testar hipóteses e buscar diferentes possibilidades

18. Diante de uma decisão importante, você tende a:
    a) Seguir seu instinto imediato
    b) Considerar experiências anteriores
    c) Ouvir opiniões diversas antes de escolher
    d) Listar prós e contras de forma lógica

19. Em trabalhos em grupo, você gosta mais de:
    a) Ação direta, resolver o que aparece no momento
    b) Controlar recursos, planejar e dividir funções
    c) Incentivar pessoas e criar espírito de equipe
    d) Identificar falhas e buscar soluções inteligentes

20. Quando pensa em carreira, você prefere:
    a) Um campo dinâmico, cheio de ação e desafios
    b) Um caminho sólido, com estabilidade e previsibilidade
    c) Um trabalho com impacto humano e social
    d) Uma área inovadora, que estimule raciocínio e criatividade
```

### 5.3 Regra de cálculo do resultado

O teste usa **contagem simples de letras**, igual ao quadro no rodapé da folha:

1. Contar quantas vezes o aluno escolheu **A**, **B**, **C** e **D** nas 20 questões.
2. O **perfil principal** é aquele com maior contagem.
3. Em caso de empate, exibir ambos como perfis principais.
4. Exibir todos os 4 perfis com suas pontuações (do maior para o menor).

A função de cálculo fica isolada em `src/lib/calcularResultado.js`:

```js
// respostas: { "1": "A", "2": "C", ... }
export function calcularResultado(respostas) {
  const contagem = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(respostas).forEach(letra => {
    if (contagem[letra] !== undefined) contagem[letra]++;
  });
  const ranking = Object.entries(contagem)
    .sort((x, y) => y[1] - x[1]);
  return { contagem, ranking };
}
```

### 5.4 Descrição dos perfis

Usar este conteúdo na Tela 4. Pode ser colocado também em `src/data/teste.js`:

**Perfil A — Executor**
> Você age com energia, iniciativa e foco em resultados rápidos. Gosta de desafios, não tem medo de errar e prefere aprender na prática. É o tipo que lidera pelo exemplo e se destaca em ambientes dinâmicos.
> **Cursos sugeridos:** Educação Física, Engenharia Civil, Administração, Enfermagem, Farmácia, Fisioterapia, Odontologia.

**Perfil B — Organizador**
> Você valoriza estrutura, disciplina e processos bem definidos. É confiável, metódico e entrega resultados consistentes. Trabalha melhor quando há clareza de funções e previsibilidade.
> **Cursos sugeridos:** Ciências Contábeis, Administração, Análise e Des. de Sistemas, Engenharia Civil, Biomedicina.

**Perfil C — Humanizador**
> Você se move pelo propósito de impactar positivamente a vida das pessoas. Tem empatia, sabe ouvir e é ótimo em trabalho em equipe. Ambientes colaborativos e com propósito social são o seu lugar.
> **Cursos sugeridos:** Psicologia, Enfermagem, Pedagogia, Serviço Social, Terapia Ocupacional, Fonoaudiologia, Medicina Veterinária, Nutrição.

**Perfil D — Analista/Inovador**
> Você pensa antes de agir, questiona padrões e busca soluções que ninguém havia pensado. Tem perfil investigativo e criativo, e se destaca em áreas que exigem raciocínio lógico e inovação.
> **Cursos sugeridos:** Análise e Des. de Sistemas, Direito, Biomedicina, Engenharia Civil, Ciências Contábeis, Farmácia.

---

## 6. Banco de dados (Supabase)

Rodar no **SQL Editor** do Supabase:

```sql
-- Tabela de inscrições (ficha)
create table public.inscricoes (
  id uuid primary key,                   -- gerado no front com crypto.randomUUID()
  nome text not null,
  data_nascimento date,
  cpf text,
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
  respostas jsonb not null,              -- { "1": "A", "2": "C", ... }
  contagem jsonb not null,               -- { "A": 8, "B": 5, "C": 4, "D": 3 }
  perfil_principal text not null,        -- "A", "B", "C" ou "D"
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

-- Área do proprietário (seção 3-B): só existe um usuário admin, criado manualmente
-- no Supabase Auth (Authentication > Users), sem cadastro público. Por isso liberar
-- para todo o papel "authenticated" é seguro aqui.
create policy "authenticated pode excluir inscricao"
  on public.inscricoes for delete to authenticated
  using (true);

-- View para consulta/exportação (usada na área do proprietário)
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

-- Bloquear acesso anônimo à view; o proprietário (authenticated) pode ler
revoke all on public.vw_resultados from anon;
grant select on public.vw_resultados to authenticated;
```

Depois de rodar esse SQL, criar o usuário admin em **Authentication > Users** no painel do Supabase (e-mail + senha), sem habilitar cadastro público.

**Importante:** nos inserts pelo `supabase-js`, **não** usar `.select()` depois do `.insert()`. Como o anon não tem permissão de leitura, o `.select()` causaria erro. O `id` é gerado no front justamente para evitar isso.

---

## 7. Estrutura de pastas

```
teste-vocacional/
├── public/
│   └── logo.png             ← fornecido pelo usuário depois
├── src/
│   ├── components/
│   │   ├── BoasVindas.jsx
│   │   ├── FichaInscricao.jsx
│   │   ├── TesteVocacional.jsx
│   │   ├── BarraProgresso.jsx
│   │   └── Resultado.jsx
│   ├── data/
│   │   └── teste.js         ← perguntas e descrições dos perfis
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── calcularResultado.js
│   │   └── validacoes.js    ← CPF, e-mail, campos obrigatórios
│   ├── App.jsx
│   └── main.jsx
├── .env.local                ← não commitar
├── .env.example
├── index.html
└── package.json
```

---

## 8. Visual

- Identidade visual da **Estácio**: azul escuro `#003F73` como cor principal, azul claro `#0070C0` como cor de destaque, fundo branco.
- Logo no topo de todas as telas (`public/logo.png`). Se ainda não existir, reservar o espaço com um placeholder.
- Fonte grande e legível (mínimo 16px no corpo, 18px nas opções do teste).
- Conteúdo centralizado, largura máxima 900px.
- Botões com estado de carregamento ("Salvando..." / "Enviando...") e desabilitados durante o envio para evitar cadastro duplicado.
- Nas opções do teste: cards clicáveis (não radio buttons escondidos) — ao clicar, o card fica com borda azul e fundo levemente colorido.
- Perguntas sem resposta no bloco atual devem ficar com borda vermelha ao tentar avançar.

---

## 9. Etapas de desenvolvimento (parar ao fim de cada uma)

**Etapa 1 — Projeto base**
- Criar o projeto com `npm create vite@latest teste-vocacional -- --template react`.
- Instalar Tailwind CSS e `@supabase/supabase-js`.
- Criar `src/lib/supabase.js` lendo as variáveis de ambiente.
- Criar `src/data/teste.js` com os perfis e as 20 perguntas da seção 5.2.
- ✅ Validação: `npm run dev` abre a Tela 1 (Boas-vindas) no navegador sem erros no console.

**Etapa 2 — Ficha + gravação**
- Tela 2 completa: todos os campos da seção 4.1, validações, select de cursos (com grupos), select de turno e modalidade.
- CPF é opcional, sem validação de dígitos e sem exigência de ser único (permite múltiplos cadastros com o mesmo CPF).
- Máscaras de data, CPF e telefone.
- Insert em `inscricoes` ao clicar em "Começar teste".
- ✅ Validação: preencher a ficha e confirmar o registro na tabela `inscricoes` do Supabase (Table Editor).

**Etapa 3 — Teste vocacional**
- Tela 3 com blocos de 5 perguntas, barra de progresso e navegação Voltar/Próximo.
- Cards clicáveis para as opções (A/B/C/D).
- Salvar progresso no `localStorage` (id da inscrição + respostas respondidas até agora).
- Se o aluno recarregar a página, retomar de onde parou (perguntas já respondidas preservadas).
- ✅ Validação: responder até a pergunta 8, recarregar, confirmar que as respostas anteriores estão salvas e a navegação retoma corretamente.

**Etapa 4 — Resultado + gravação**
- Chamar `calcularResultado(respostas)` ao finalizar.
- Insert em `respostas_teste` com respostas, contagem e perfil_principal.
- Tela 4: exibir perfil principal, descrição, cursos sugeridos e tabela A/B/C/D com pontuações.
- Limpar `localStorage` ao clicar em "Voltar ao início".
- ✅ Validação: ver o registro em `respostas_teste` e o aluno completo na `vw_resultados`.

**Etapa 5 — Área do proprietário**
- Tela 5 (`/admin`): login via Supabase Auth, tabela de candidatos, exportar CSV, excluir individual e excluir tudo (com confirmação).
- ✅ Validação: logar, ver os candidatos cadastrados, exportar o CSV, excluir um candidato e confirmar que sumiu do banco.

**Etapa 6 — Deploy na Vercel**
- Criar repositório no GitHub e fazer o primeiro push.
- Importar o projeto na Vercel e configurar as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
- Criar o usuário admin no Supabase Auth (seção 6).
- ✅ Validação: acessar o link público, fazer um cadastro completo, confirmar o registro no Supabase, e logar em `/admin` com o usuário criado.

---

## 10. Fora do escopo desta versão

- Envio automático de resultado por WhatsApp ou e-mail.
- Múltiplos usuários administradores ou níveis de permissão diferentes na área do proprietário.
