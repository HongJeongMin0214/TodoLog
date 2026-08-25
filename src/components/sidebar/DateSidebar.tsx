import SidebarHeader from './SidebarHeader'
import DateList from './DateList'

interface DateSidebarProps {
  onSelectLogo: () => void
  onSelectToday: () => void
}

function DateSidebar({ onSelectLogo, onSelectToday }: DateSidebarProps) {
  return (
    <aside className="date-sidebar">
      <SidebarHeader onSelectLogo={onSelectLogo} onSelectToday={onSelectToday} />
      <DateList />
    </aside>
  )
}

export default DateSidebar
