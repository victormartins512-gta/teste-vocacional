export const perfis = {
  A: {
    nome: 'Executor',
    descricao:
      'Você age com energia, iniciativa e foco em resultados rápidos. Gosta de desafios, não tem medo de errar e prefere aprender na prática. É o tipo que lidera pelo exemplo e se destaca em ambientes dinâmicos.',
    cursos: [
      'Educação Física',
      'Engenharia Civil',
      'Administração',
      'Enfermagem',
      'Farmácia',
      'Fisioterapia',
      'Odontologia',
    ],
  },
  B: {
    nome: 'Organizador',
    descricao:
      'Você valoriza estrutura, disciplina e processos bem definidos. É confiável, metódico e entrega resultados consistentes. Trabalha melhor quando há clareza de funções e previsibilidade.',
    cursos: [
      'Ciências Contábeis',
      'Administração',
      'Análise e Des. de Sistemas',
      'Engenharia Civil',
      'Biomedicina',
    ],
  },
  C: {
    nome: 'Humanizador',
    descricao:
      'Você se move pelo propósito de impactar positivamente a vida das pessoas. Tem empatia, sabe ouvir e é ótimo em trabalho em equipe. Ambientes colaborativos e com propósito social são o seu lugar.',
    cursos: [
      'Psicologia',
      'Enfermagem',
      'Pedagogia',
      'Serviço Social',
      'Terapia Ocupacional',
      'Fonoaudiologia',
      'Medicina Veterinária',
      'Nutrição',
    ],
  },
  D: {
    nome: 'Analista/Inovador',
    descricao:
      'Você pensa antes de agir, questiona padrões e busca soluções que ninguém havia pensado. Tem perfil investigativo e criativo, e se destaca em áreas que exigem raciocínio lógico e inovação.',
    cursos: [
      'Análise e Des. de Sistemas',
      'Direito',
      'Biomedicina',
      'Engenharia Civil',
      'Ciências Contábeis',
      'Farmácia',
    ],
  },
}

export const perguntas = [
  {
    id: 1,
    texto: 'Quando você precisa aprender algo novo, prefere:',
    opcoes: [
      { valor: 'A', texto: 'Colocar em prática logo, mesmo sem saber tudo' },
      { valor: 'B', texto: 'Seguir um passo a passo estruturado' },
      { valor: 'C', texto: 'Conversar com pessoas e aprender de forma colaborativa' },
      { valor: 'D', texto: 'Investigar a fundo, entender teorias e questionar' },
    ],
  },
  {
    id: 2,
    texto: 'No trabalho ideal, você gostaria de ter:',
    opcoes: [
      { valor: 'A', texto: 'Desafios constantes, sem rotina fixa' },
      { valor: 'B', texto: 'Estabilidade, clareza de funções e metas definidas' },
      { valor: 'C', texto: 'Contato humano e propósito social' },
      { valor: 'D', texto: 'Autonomia intelectual e liberdade para criar soluções' },
    ],
  },
  {
    id: 3,
    texto: 'Quando surge um problema inesperado, sua reação é:',
    opcoes: [
      { valor: 'A', texto: 'Agir rápido e improvisar até resolver' },
      { valor: 'B', texto: 'Usar experiências passadas e seguir padrões conhecidos' },
      { valor: 'C', texto: 'Ouvir diferentes pontos de vista antes de agir' },
      { valor: 'D', texto: 'Analisar o problema em profundidade antes de decidir' },
    ],
  },
  {
    id: 4,
    texto: 'Em um grupo de trabalho, você costuma ser quem:',
    opcoes: [
      { valor: 'A', texto: 'Toma a frente e coloca todos em movimento' },
      { valor: 'B', texto: 'Organiza processos, recursos e prazos' },
      { valor: 'C', texto: 'Motiva e cuida da integração das pessoas' },
      { valor: 'D', texto: 'Questiona, propõe novas ideias e soluções' },
    ],
  },
  {
    id: 5,
    texto: 'Você se sente mais motivado quando:',
    opcoes: [
      { valor: 'A', texto: 'Tem metas desafiadoras e obstáculos para superar' },
      { valor: 'B', texto: 'Conquista segurança e reconhecimento pelo esforço constante' },
      { valor: 'C', texto: 'Vê impacto positivo do seu trabalho em outras pessoas' },
      { valor: 'D', texto: 'Consegue transformar ideias em algo útil e inovador' },
    ],
  },
  {
    id: 6,
    texto: 'Você se sente mais satisfeito quando:',
    opcoes: [
      { valor: 'A', texto: 'Supera obstáculos e prova sua capacidade' },
      { valor: 'B', texto: 'Cumpre o que se comprometeu e entrega resultados' },
      { valor: 'C', texto: 'Ajuda alguém a alcançar algo importante' },
      { valor: 'D', texto: 'Encontra soluções que ninguém havia pensado' },
    ],
  },
  {
    id: 7,
    texto: 'Em ambientes de pressão, você costuma:',
    opcoes: [
      { valor: 'A', texto: 'Tomar a frente e agir sem demora' },
      { valor: 'B', texto: 'Seguir processos e manter disciplina' },
      { valor: 'C', texto: 'Apoiar os outros e buscar cooperação' },
      { valor: 'D', texto: 'Analisar rapidamente para achar a melhor saída' },
    ],
  },
  {
    id: 8,
    texto: 'Você gosta de ambientes que oferecem:',
    opcoes: [
      { valor: 'A', texto: 'Adrenalina, movimento e desafios constantes' },
      { valor: 'B', texto: 'Estrutura, segurança e regras claras' },
      { valor: 'C', texto: 'Colaboração, diversidade e troca de ideias' },
      { valor: 'D', texto: 'Autonomia, pesquisa e espaço para criar' },
    ],
  },
  {
    id: 9,
    texto: 'Para você, trabalhar em equipe significa:',
    opcoes: [
      { valor: 'A', texto: 'Colocar todos em ação rumo ao objetivo' },
      { valor: 'B', texto: 'Garantir que cada um cumpra sua parte' },
      { valor: 'C', texto: 'Manter boas relações e motivar o grupo' },
      { valor: 'D', texto: 'Pensar juntos em soluções inovadoras' },
    ],
  },
  {
    id: 10,
    texto: 'Uma frase que se aproxima mais de você é:',
    opcoes: [
      { valor: 'A', texto: 'Prefiro arriscar e aprender fazendo' },
      { valor: 'B', texto: 'Disciplina e foco trazem resultados' },
      { valor: 'C', texto: 'As pessoas são o que mais importa' },
      { valor: 'D', texto: 'Tudo pode ser entendido, melhorado ou reinventado' },
    ],
  },
  {
    id: 11,
    texto: 'Para você, sucesso profissional significa:',
    opcoes: [
      { valor: 'A', texto: 'Ser referência prática, admirado pela performance' },
      { valor: 'B', texto: 'Alcançar estabilidade financeira e posição sólida' },
      { valor: 'C', texto: 'Contribuir para a sociedade e ser respeitado pelo caráter' },
      { valor: 'D', texto: 'Criar algo novo, ser inovador ou especialista reconhecido' },
    ],
  },
  {
    id: 12,
    texto: 'Em uma liderança, você prefere:',
    opcoes: [
      { valor: 'A', texto: 'Liderar em momentos críticos, mostrando atitude' },
      { valor: 'B', texto: 'Ter controle do processo do início ao fim' },
      { valor: 'C', texto: 'Inspirar, unir talentos e criar engajamento' },
      { valor: 'D', texto: 'Usar estratégia, análise e visão de longo prazo' },
    ],
  },
  {
    id: 13,
    texto: 'Em termos de aprendizado, você se conecta mais com:',
    opcoes: [
      { valor: 'A', texto: 'Experiências práticas, testes e desafios físicos' },
      { valor: 'B', texto: 'Métodos organizados, métricas e treinamentos formais' },
      { valor: 'C', texto: 'Histórias, culturas, debates e trocas humanas' },
      { valor: 'D', texto: 'Matemática, lógica, tecnologia e inovação' },
    ],
  },
  {
    id: 14,
    texto: 'Quando pensa no futuro, você sonha em:',
    opcoes: [
      { valor: 'A', texto: 'Ser excelente na sua profissão, alguém prático e reconhecido' },
      { valor: 'B', texto: 'Crescer passo a passo, ocupando cargos estáveis' },
      { valor: 'C', texto: 'Deixar impacto positivo e transformar vidas' },
      { valor: 'D', texto: 'Desvendar problemas complexos e criar soluções únicas' },
    ],
  },
  {
    id: 15,
    texto: 'Você é mais eficiente quando:',
    opcoes: [
      { valor: 'A', texto: 'Precisa reagir e agir rapidamente' },
      { valor: 'B', texto: 'Tem uma rotina organizada e previsível' },
      { valor: 'C', texto: 'Está cercado de pessoas engajadas' },
      { valor: 'D', texto: 'Precisa resolver enigmas ou problemas desafiadores' },
    ],
  },
  {
    id: 16,
    texto: 'Quando recebe elogios, o que mais valoriza é:',
    opcoes: [
      { valor: 'A', texto: 'Sua coragem, energia ou iniciativa' },
      { valor: 'B', texto: 'Sua responsabilidade, organização e dedicação' },
      { valor: 'C', texto: 'Sua empatia, ética ou capacidade de inspirar' },
      { valor: 'D', texto: 'Sua inteligência, visão ou criatividade' },
    ],
  },
  {
    id: 17,
    texto: 'Ao iniciar um novo projeto, você tende a:',
    opcoes: [
      { valor: 'A', texto: 'Entrar com tudo e aprender no caminho' },
      { valor: 'B', texto: 'Planejar bem cada etapa antes de começar' },
      { valor: 'C', texto: 'Motivar a equipe e criar harmonia' },
      { valor: 'D', texto: 'Testar hipóteses e buscar diferentes possibilidades' },
    ],
  },
  {
    id: 18,
    texto: 'Diante de uma decisão importante, você tende a:',
    opcoes: [
      { valor: 'A', texto: 'Seguir seu instinto imediato' },
      { valor: 'B', texto: 'Considerar experiências anteriores' },
      { valor: 'C', texto: 'Ouvir opiniões diversas antes de escolher' },
      { valor: 'D', texto: 'Listar prós e contras de forma lógica' },
    ],
  },
  {
    id: 19,
    texto: 'Em trabalhos em grupo, você gosta mais de:',
    opcoes: [
      { valor: 'A', texto: 'Ação direta, resolver o que aparece no momento' },
      { valor: 'B', texto: 'Controlar recursos, planejar e dividir funções' },
      { valor: 'C', texto: 'Incentivar pessoas e criar espírito de equipe' },
      { valor: 'D', texto: 'Identificar falhas e buscar soluções inteligentes' },
    ],
  },
  {
    id: 20,
    texto: 'Quando pensa em carreira, você prefere:',
    opcoes: [
      { valor: 'A', texto: 'Um campo dinâmico, cheio de ação e desafios' },
      { valor: 'B', texto: 'Um caminho sólido, com estabilidade e previsibilidade' },
      { valor: 'C', texto: 'Um trabalho com impacto humano e social' },
      { valor: 'D', texto: 'Uma área inovadora, que estimule raciocínio e criatividade' },
    ],
  },
]
