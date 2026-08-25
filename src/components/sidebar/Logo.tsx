interface LogoProps {
  onClick: () => void
}

function Logo({ onClick }: LogoProps) {
  return (
    <button type="button" className="logo" onClick={onClick}>
      TodoLog
    </button>
  )
}

export default Logo
