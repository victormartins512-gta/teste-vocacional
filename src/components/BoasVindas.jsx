import TrajetoSvg from './TrajetoSvg'

function BoasVindas({ onComecar }) {
  return (
    <div className="flex h-dvh flex-col">
      <header className="shrink-0 border-b border-linha bg-bruma px-6 py-3 sm:py-4">
        <div className="mx-auto max-w-[1100px] text-center lg:text-left">
          <img src="/logo-estacio-castanhal.png" alt="Estácio Castanhal" className="inline-block h-9 w-auto sm:h-11 lg:h-12" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-[1100px] flex-col-reverse items-center justify-center gap-4 px-6 py-6 sm:gap-8 sm:py-10 lg:flex-row lg:justify-between lg:gap-4 lg:py-0">
          <div className="flex w-full max-w-[560px] flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="font-display text-[1.65rem] leading-[1.15] font-semibold tracking-[-0.01em] text-estacio-dark sm:text-[2.5rem] lg:text-[3.25rem]">
              Descubra o curso que combina com você
            </h1>

            <p className="mt-3 max-w-[440px] text-base text-grafite sm:mt-5 sm:text-lg">
              Um teste rápido de perfil profissional. Leva cerca de{' '}
              <strong className="font-semibold text-estacio-dark">10 minutos</strong> e te ajuda a
              decidir com mais clareza.
            </p>

            <button
              type="button"
              onClick={onComecar}
              className="mt-5 w-full rounded-lg bg-estacio-blue px-9 py-3.5 text-lg font-medium text-white shadow-[0_8px_24px_-8px_rgba(0,112,192,0.55)] transition-transform duration-150 hover:bg-estacio-dark active:scale-[0.98] sm:mt-8 sm:w-auto"
            >
              Quero começar
            </button>

            <p className="mt-3 text-xs text-grafite/70 sm:mt-4 sm:text-sm">
              Seus dados ficam protegidos, conforme a LGPD.
            </p>
          </div>

          <div className="hidden w-full max-w-[220px] sm:block lg:max-w-[360px]">
            <TrajetoSvg className="w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoasVindas
