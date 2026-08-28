import { useState } from 'react'
import ActivityBar from '../components/ActivityBar/ActivityBar'
import TodoDrawer from '../components/TodoDrawer/TodoDrawer'
import MainContent from '../components/MainContent/MainContent'
import './TodoLogPage.css'

type MainContentMode = 'memo' | 'calendar'

function TodoLogPage() {
  const [MainContentMode] = useState<MainContentMode>('memo')

  return (
    <div className="todo-log-page">
      <ActivityBar />
      <TodoDrawer/>
      <MainContent mode={MainContentMode} />
    </div>
  )
}

export default TodoLogPage
