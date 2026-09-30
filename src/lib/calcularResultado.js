// respostas: { "1": "A", "2": "C", ... } — ver seção 5.3 da SPEC.
export function calcularResultado(respostas) {
  const contagem = { A: 0, B: 0, C: 0, D: 0 }
  Object.values(respostas).forEach((letra) => {
    if (contagem[letra] !== undefined) contagem[letra]++
  })
  const ranking = Object.entries(contagem).sort((a, b) => b[1] - a[1])
  const maiorPontuacao = ranking[0][1]
  const perfisPrincipais = ranking.filter(([, pontos]) => pontos === maiorPontuacao).map(([letra]) => letra)

  return { contagem, ranking, perfisPrincipais }
}
