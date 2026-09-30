import TrajetoSvg from './TrajetoSvg'

function BoasVindas({ onComecar }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1100px] flex-col-reverse items-center gap-10 px-6 py-12 lg:flex-row lg:justify-between lg:gap-4 lg:py-0">
      <div className="flex w-full max-w-[560px] flex-col items-center text-center lg:items-start lg:text-left">
        <img
          src="/logo.png"
          alt="Estácio Castanhal"
          className="mb-10 h-10"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />

        <h1 className="font-display text-[2.25rem] leading-[1.1] font-semibold tracking-[-0.01em] text-estacio-dark sm:text-[2.75rem] lg:text-[3.25rem]">
          Descubra o curso que combina com você
        </h1>

        <p className="mt-5 max-w-[440px] text-lg text-grafite">
          Um teste rápido de perfil profissional. Leva cerca de{' '}
          <strong className="font-semibold text-estacio-dark">10 minutos</strong> e te ajuda a
          decidir com mais clareza.
        </p>

        <button
          type="button"
          onClick={onComecar}
          className="mt-8 rounded-lg bg-estacio-blue px-9 py-3.5 text-lg font-medium text-white shadow-[0_8px_24px_-8px_rgba(0,112,192,0.55)] transition-transform duration-150 hover:bg-estacio-dark active:scale-[0.98]"
        >
          Quero começar
        </button>

        <p className="mt-4 text-sm text-grafite/70">
          Seus dados ficam protegidos, conforme a LGPD.
        </p>
      </div>

      <div className="w-full max-w-[280px] lg:max-w-[360px]">
        <TrajetoSvg className="w-full" />
      </div>
    </div>
  )
}

export default BoasVindas
