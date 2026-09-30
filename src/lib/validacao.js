// Máscaras e validações da Ficha de Cadastro (seção 4.1 da SPEC)

export function mascararData(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 8)
  const dia = digitos.slice(0, 2)
  const mes = digitos.slice(2, 4)
  const ano = digitos.slice(4, 8)
  if (digitos.length <= 2) return dia
  if (digitos.length <= 4) return `${dia}/${mes}`
  return `${dia}/${mes}/${ano}`
}

export function validarData(valor) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor)
  if (!match) return null
  const dia = Number(match[1])
  const mes = Number(match[2])
  const ano = Number(match[3])
  const data = new Date(ano, mes - 1, dia)
  const valida =
    data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia
  if (!valida) return null
  return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

export function mascararCPF(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  const parte1 = digitos.slice(0, 3)
  const parte2 = digitos.slice(3, 6)
  const parte3 = digitos.slice(6, 9)
  const parte4 = digitos.slice(9, 11)
  let resultado = parte1
  if (parte2) resultado += `.${parte2}`
  if (parte3) resultado += `.${parte3}`
  if (parte4) resultado += `-${parte4}`
  return resultado
}

export function validarCPF(valor) {
  const cpf = valor.replace(/\D/g, '')
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  const calcularDigito = (base) => {
    let soma = 0
    let peso = base.length + 1
    for (const char of base) {
      soma += Number(char) * peso
      peso -= 1
    }
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const digito1 = calcularDigito(cpf.slice(0, 9))
  const digito2 = calcularDigito(cpf.slice(0, 9) + digito1)

  return cpf === cpf.slice(0, 9) + String(digito1) + String(digito2)
}

export function mascararTelefone(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  const ddd = digitos.slice(0, 2)
  const resto = digitos.slice(2)
  if (digitos.length === 0) return ''
  if (digitos.length < 3) return `(${ddd}`
  if (resto.length <= 4) return `(${ddd}) ${resto}`
  if (resto.length <= 8) return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`
  return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5, 9)}`
}

export function validarTelefone(valor) {
  const digitos = valor.replace(/\D/g, '')
  return digitos.length === 10 || digitos.length === 11
}

export function validarEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
}

export function validarNomeCompleto(valor) {
  return valor.trim().split(/\s+/).filter(Boolean).length >= 2
}
