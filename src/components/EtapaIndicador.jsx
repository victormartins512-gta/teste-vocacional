// A trajetória da Boas-vindas (TrajetoSvg) reaparece aqui como progresso real:
// o trecho em âmbar é o caminho já percorrido nas telas do fluxo.
function EtapaIndicador({ etapaAtual, totalEtapas = 4, rotulo }) {
  return (
    <div className="mx-auto mb-10 max-w-[720px]">
      <div className="flex gap-1.5">
        {Array.from({ length: totalEtapas }).map((_, indice) => (
          <div
            key={indice}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              indice < etapaAtual ? 'bg-bussola' : 'bg-linha'
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-grafite/70">
        Etapa {etapaAtual} de {totalEtapas}: {rotulo}
      </p>
    </div>
  )
}

export default EtapaIndicador
