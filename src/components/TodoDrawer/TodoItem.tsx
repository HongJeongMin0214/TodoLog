import type { Todo } from '../../types/todo'
import { Check, X } from 'lucide-react'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  return (
    <li className="todo-item">
      <button
        type="button"
        className="todo-item__toggle"
        role="checkbox"
        aria-checked={todo.done}
        onClick={() => onToggle(todo.id)}
      >
        <span className="todo-item__box" aria-hidden="true">
          {todo.done && <Check size={12} strokeWidth={3} />}
        </span>
        <span className={todo.done ? 'todo-item__text--done' : 'todo-item__text'}>
          {todo.text}
        </span>
      </button>
      <button type="button" onClick={() => onRemove(todo.id)} aria-label="삭제">
        <X size={14} />
      </button>
    </li>
  )
}

export default TodoItem
