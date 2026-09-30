function escaparCampoCsv(valor) {
  const texto = valor === null || valor === undefined ? '' : String(valor)
  if (/[",;\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`
  }
  return texto
}

// Delimitador ; (não ,) porque o Excel em português usa vírgula como separador decimal.
export function exportarCsv(nomeArquivo, colunas, linhas) {
  const cabecalho = colunas.map((c) => escaparCampoCsv(c.rotulo)).join(';')
  const corpo = linhas
    .map((linha) =>
      colunas.map((c) => escaparCampoCsv(c.formatar ? c.formatar(linha) : linha[c.chave])).join(';')
    )
    .join('\n')

  const blob = new Blob([`﻿${cabecalho}\n${corpo}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
