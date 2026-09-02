import type { Todo } from '../../types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  return (
    <li className="todo-item">
      <label>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <span className={todo.done ? 'todo-item__text--done' : 'todo-item__text'}>
          {todo.text}
        </span>
      </label>
      <button type="button" onClick={() => onRemove(todo.id)} aria-label="삭제">
        ×
      </button>
    </li>
  )
}

export default TodoItem