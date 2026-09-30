function BarraProgresso({ blocoAtual, totalBlocos, perguntaInicial, perguntaFinal }) {
  return (
    <div className="mx-auto mb-10 max-w-[720px]">
      <div className="flex gap-1.5">
        {Array.from({ length: totalBlocos }).map((_, indice) => (
          <div
            key={indice}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              indice < blocoAtual ? 'bg-bussola' : 'bg-linha'
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-grafite/70">
        Bloco {blocoAtual} de {totalBlocos}: perguntas {perguntaInicial}–{perguntaFinal}
      </p>
    </div>
  )
}

export default BarraProgresso
