import SidebarToggleButton from './SidebarToggleButton'
import SidebarHeader from './SidebarHeader'
import DateList from './DateList'
import './DateSidebar.css'

interface DateSidebarProps {
  isOpen: boolean
  onToggleSidebar: () => void
  onSelectLogo: () => void
  onSelectToday: () => void
}

function DateSidebar({ isOpen, onToggleSidebar, onSelectLogo, onSelectToday }: DateSidebarProps) {
  return (
    <aside className={`date-sidebar ${isOpen ? '' : 'date-sidebar--collapsed'}`}>
      {/* 사이드바가 접히든 열리든 항상 화면에 보여야 하는 토글 스위치 버튼 */}
      <SidebarToggleButton isOpen={isOpen} onClick={onToggleSidebar} />
      
      {/* 사이드바가 접히면 opacity: 0으로 숨겨질 안쪽 내용물들 (헤더 + 날짜목록) */}
      <div className="date-sidebar__content">
        <SidebarHeader onSelectLogo={onSelectLogo} onSelectToday={onSelectToday} />
        <DateList />
      </div>
    </aside>
  )
}

export default DateSidebar
