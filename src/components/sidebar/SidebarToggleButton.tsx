interface SidebarToggleButtonProps {
  isOpen: boolean
  onClick: () => void
}

function SidebarToggleButton({ isOpen, onClick }: SidebarToggleButtonProps) {
  return (
    <button
      type="button"
      className="sidebar-toggle-button"
      onClick={onClick}
      aria-label={isOpen ? '사이드바 접기' : '사이드바 펼치기'}
    >
      ☰
    </button>
  )
}

export default SidebarToggleButton
