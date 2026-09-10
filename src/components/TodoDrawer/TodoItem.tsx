import { useState, useRef, useLayoutEffect } from 'react'
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
  const editRef = useRef<HTMLTextAreaElement>(null) // 편집 중인 textarea에 포커스 주기 위해 ref 사용

  // textarea 높이를 내용에 맞춤 (비편집 버튼처럼 여러 줄로 늘어나도록)
  const autoResize = () => {
    const el = editRef.current // 편집 중인 textarea
    if (!el) return // ref가 아직 연결되지 않았으면 종료
    el.style.height = 'auto' // 높이를 auto로 초기화 후 scrollHeight를 읽어야 정확한 높이 계산 가능
    el.style.height = `${el.scrollHeight}px`
  }
  useLayoutEffect(() => { // useLayoutEffect는 useEffect보다 먼저 실행되어 편집 모드 전환 시 textarea 높이가 깜빡임 없이 바로 적용됨
    if (editing) autoResize()
  }, [editing]) // []는 의존성 배열(감시자 역할)로 editing이 바뀔 때마다 실행됨

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
        <textarea
          ref={editRef}
          className="todo-item__edit"
          rows={1} // rows=1: 최소 높이 1줄, 내용이 많으면 autoResize()로 늘어남
          autoFocus
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            autoResize()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault() // Enter=저장 (textarea 기본 줄바꿈 막음)
              commit()
            }
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

      {/* 삭제 버튼: 편집 중이 아닐 땐 자리만 예약(visibility:hidden)해 편집 전환 시 폭 점프 방지 */}
      <button
        type="button"
        className={editing ? 'todo-item__delete' : 'todo-item__delete todo-item__delete--hidden'}
        tabIndex={editing ? 0 : -1} // 편집 중이 아닐 땐 포커스 불가. 0: 편집 중이면 탭 순서에 포함, -1: 편집 중이 아니면 탭 순서에서 제외
        aria-hidden={!editing}
        onMouseDown={(e) => {
          e.preventDefault() // mousedown에서 preventDefault: 인풋 onBlur(저장)보다 먼저 실행되어 버튼이 사라지는 것 방지
          onRemove(todo.id)
        }}
        aria-label="삭제"
      >
        <X size={14} />
      </button>
    </li>
  )
}

export default TodoItem
