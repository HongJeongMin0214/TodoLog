import Logo from './Logo'
import TodayDateItem from './TodayDateItem'

interface SidebarHeaderProps {
  onSelectLogo: () => void
  onSelectToday: () => void
}

function SidebarHeader({ onSelectLogo, onSelectToday }: SidebarHeaderProps) {
  return (
    <div className="sidebar-header">
      <Logo onClick={onSelectLogo} />
      <TodayDateItem onClick={onSelectToday} />
    </div>
  )
}

export default SidebarHeader
