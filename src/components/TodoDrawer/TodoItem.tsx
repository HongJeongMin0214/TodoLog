import { useState } from 'react'
import type { Todo } from '../../types/todo'
import { Check, X } from 'lucide-react'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onEdit: (id: string, text: string) => void
  onRemove: (id: string) => void
}

function TodoItem({ todo, onToggle, onEdit, onRemove }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text) // draft: 편집 중인 텍스트 (인풋에 바인딩). setDraft: 편집 완료 시 onEdit 호출 후 draft를 todo.text로 초기화

  const startEdit = () => {
    setDraft(todo.text)
    setEditing(true)
  }
  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== todo.text) // 공백 제거 후, 내용이 바뀌었으면
      onEdit(todo.id, trimmed)
    setEditing(false) // 편집 모드 종료 (인풋 사라짐)
  }
  const cancel = () => {
    setDraft(todo.text) // 편집 취소 시 draft를 원래 텍스트로 되돌림
    setEditing(false)
  }

  return (
    <li className="todo-item">
      {/* 체크박스: 클릭하면 완료 토글 */}
      <button
        type="button"
        className="todo-item__box"
        role="checkbox"
        aria-checked={todo.done}
        aria-label={todo.done ? '완료 취소' : '완료'}
        onClick={() => onToggle(todo.id)}
      >
        {todo.done && <Check size={12} strokeWidth={3} />}
      </button>

      {editing ? (
        <input
          className="todo-item__edit"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') cancel()
          }}
          onBlur={commit}
        />
      ) : (
        <button
          type="button"
          className={todo.done ? 'todo-item__text--done' : 'todo-item__text'}
          onDoubleClick={startEdit}
        >
          {todo.text}
        </button>
      )}

      {/* 삭제 버튼은 편집 중일 때만 표시 */}
      {editing && (
        <button
          type="button"
          className="todo-item__delete"
          onMouseDown={(e) => {
            e.preventDefault() // mousedown에서 preventDefault: 인풋 onBlur(저장)보다 먼저 실행되어 버튼이 사라지는 것 방지
            onRemove(todo.id)
          }}
          aria-label="삭제"
        >
          <X size={14} />
        </button>
      )}
    </li>
  )
}

export default TodoItem
