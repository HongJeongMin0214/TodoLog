import { useState } from 'react'
import ActivityBar from '../components/ActivityBar/ActivityBar'
import TodoDrawer from '../components/TodoDrawer/TodoDrawer'
import MainContent from '../components/MainContent/MainContent'
import './TodoLogPage.css'

type MainView = 'calendar' | 'memo'

function TodoLogPage() {
  const [isTodoDrawerOpen, setIsTodoDrawerOpen] = useState(true)
  const [mainView, setMainView] = useState<MainView>('calendar')

  return (
    <div className="todo-log-page">
      <ActivityBar
        isTodoDrawerOpen={isTodoDrawerOpen}
        mainView={mainView}
        onToggleTodoDrawer={() => setIsTodoDrawerOpen((open) => !open)}
        onSelectMainView={setMainView}
      />
      <TodoDrawer isOpen={isTodoDrawerOpen} />
      <MainContent mode={mainView} />
    </div>
  )
}

export default TodoLogPage
