import { useState } from 'react'
import TodoDrawer from '../components/TodoDrawer/TodoDrawer'
import MainContent from '../components/MainContent/MainContent'
import './TodoLogPage.css'

type MainContentMode = 'memo' | 'calendar'

function TodoLogPage() {
  const [MainContentMode] = useState<MainContentMode>('memo')

  return (
    <div className="todo-log-page">
      <TodoDrawer/>
      <MainContent mode={MainContentMode} />
    </div>
  )
}

export default TodoLogPage
