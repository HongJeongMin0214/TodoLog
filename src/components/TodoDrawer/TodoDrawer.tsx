import { useState } from 'react'
import './TodoDrawer.css'
import useTodos from '../../hooks/useTodos'
import { todayKey } from '../../lib/date'
import TodoList from './TodoList'

interface TodoDrawerProps {
  isOpen: boolean
}

function TodoDrawer({ isOpen }: TodoDrawerProps) {
  const [selectedDate] = useState<string>(() => todayKey())
  const { getTodos, addTodo, toggleTodo, removeTodo } = useTodos()

  const todos = getTodos(selectedDate)

  return (
    <aside
      className={`todo-drawer ${isOpen ? '' : 'todo-drawer--collapsed'}`}
      aria-hidden={!isOpen}
    >
      <div className="todo-drawer__inner">
        <p className="todo-drawer__date">{selectedDate}</p>

        <TodoList
          todos={todos}
          onToggle={(id) => toggleTodo(selectedDate, id)}
          onRemove={(id) => removeTodo(selectedDate, id)}
        />

        {/* 즉시 실행되는 것을 막기 위해 반드시 앞에 () =>를 붙여서 클릭 대기 상태로 포장 */}
        <button type="button" onClick={() => addTodo(selectedDate, '테스트 할 일')}>
          테스트 추가
        </button>
      </div>
    </aside>
  )
}

export default TodoDrawer