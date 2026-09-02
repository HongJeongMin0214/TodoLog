import { useState } from 'react'
import './TodoDrawer.css'
import useTodos from '../../hooks/useTodos'
import { todayKey, formatShortDate } from '../../lib/date'
import TodoList from './TodoList'
import TodoInputForm from './TodoInputForm'
import MiniCalendar from './MiniCalendar'

interface TodoDrawerProps {
  isOpen: boolean
}

function TodoDrawer({ isOpen }: TodoDrawerProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() => todayKey())
  const { getTodos, addTodo, toggleTodo, removeTodo } = useTodos()

  const todos = getTodos(selectedDate)

  return (
    <aside
      className={`todo-drawer ${isOpen ? '' : 'todo-drawer--collapsed'}`}
      aria-hidden={!isOpen}
    >
      <div className="todo-drawer__inner">
        <div className="todo-drawer__date">
          <span>{formatShortDate(selectedDate)}</span>
          {selectedDate === todayKey() && (
            <span className="todo-drawer__today">오늘</span>
          )}
        </div>

        <TodoList
          todos={todos}
          onToggle={(id) => toggleTodo(selectedDate, id)}
          onRemove={(id) => removeTodo(selectedDate, id)}
        />

        <TodoInputForm onAdd={(text) => addTodo(selectedDate, text)} />
        
        <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />
      </div>
    </aside>
  )
}

export default TodoDrawer