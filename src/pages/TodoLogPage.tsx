import { useState } from 'react'
import DateSidebar from '../components/sidebar/DateSidebar'
import DateTodoPanel from '../components/todo/DateTodoPanel'
import RightPanel from '../components/right-panel/RightPanel'
import './TodoLogPage.css'

type RightPanelMode = 'memo' | 'calendar'

function TodoLogPage() {
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('memo')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="todo-log-page">
      <DateSidebar
        isOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        onSelectLogo={() => setRightPanelMode('memo')}
        onSelectToday={() => setRightPanelMode('calendar')}
      />
      <DateTodoPanel />
      <RightPanel mode={rightPanelMode} />
    </div>
  )
}

export default TodoLogPage
