import { useState } from 'react'
import './TodoDrawer.css'
import useTodos from '../../hooks/useTodos'
import { todayKey } from '../../lib/date'
import TodoList from './TodoList'
import TodoInputForm from './TodoInputForm'

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

        <TodoInputForm onAdd={(text) => addTodo(selectedDate, text)} />

        <TodoList
          todos={todos}
          onToggle={(id) => toggleTodo(selectedDate, id)}
          onRemove={(id) => removeTodo(selectedDate, id)}
        />
      </div>
    </aside>
  )
}

export default TodoDrawer