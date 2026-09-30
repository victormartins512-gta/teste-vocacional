// Motivo visual recorrente do app: uma trajetória — referência direta ao tema
// vocacional ("encontrar seu caminho"). Reaparece, mais completa, nas telas seguintes.
function TrajetoSvg({ className }) {
  return (
    <svg
      viewBox="0 0 420 520"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M80 40 C 40 140, 180 160, 150 260 S 340 300, 300 420 S 150 470, 180 500"
        stroke="var(--color-estacio-blue)"
        strokeOpacity="0.18"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M70 30 C 30 130, 175 155, 145 255 S 335 295, 295 415 S 145 465, 175 495"
        stroke="var(--color-bussola)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="1 14"
      />
      <path
        d="M70 30 C 30 130, 175 155, 145 255 S 335 295, 295 415 S 145 465, 175 495"
        stroke="var(--color-estacio-dark)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="70" cy="30" r="9" fill="var(--color-bruma)" stroke="var(--color-estacio-dark)" strokeWidth="3" />
      <circle cx="145" cy="255" r="7" fill="var(--color-bruma)" stroke="var(--color-estacio-blue)" strokeWidth="3" />
      <circle cx="295" cy="415" r="7" fill="var(--color-bruma)" stroke="var(--color-estacio-blue)" strokeWidth="3" />
      <circle cx="175" cy="495" r="9" fill="var(--color-bussola)" />
    </svg>
  )
}

export default TrajetoSvg
