import type { Todo } from '../../types/todo'
import './TodoList.css'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

function TodoList({ todos, onToggle, onRemove }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="todo-list__empty">할 일이 없습니다</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => ( // 화살표 뒤에 소괄호 (를 쓰면 return을 생략할 수 있음
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </ul>
  )
}

export default TodoList