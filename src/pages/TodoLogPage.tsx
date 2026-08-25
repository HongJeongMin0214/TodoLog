import { useState } from 'react'
import DateSidebar from '../components/sidebar/DateSidebar'
import DateTodoPanel from '../components/todo/DateTodoPanel'
import RightPanel from '../components/right-panel/RightPanel'

type RightPanelMode = 'memo' | 'calendar'

function TodoLogPage() {
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('memo')

  return (
    <div className="todo-log-page">
      <DateSidebar
        onSelectLogo={() => setRightPanelMode('memo')}
        onSelectToday={() => setRightPanelMode('calendar')}
      />
      <DateTodoPanel />
      <RightPanel mode={rightPanelMode} />
    </div>
  )
}

export default TodoLogPage
