import { useLayoutEffect, useRef, useState } from 'react'
import { Plus, Star } from 'lucide-react'
import './TodoInputForm.css'

interface TodoInputFormProps {
  onAdd: (text: string, important: boolean) => void
}

function TodoInputForm({ onAdd }: TodoInputFormProps) {
  const [expanded, setExpanded] = useState(false) // 접힘(트리거) ↔ 펼침(입력 행)
  const [text, setText] = useState('')
  const [important, setImportant] = useState(false)
  const editRef = useRef<HTMLTextAreaElement>(null)

  // 할일 편집 textarea와 동일: 내용 길이에 맞춰 높이 자동 조절
  const autoResize = () => {
    const el = editRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }
  useLayoutEffect(() => {
    if (expanded) {
      autoResize()
      editRef.current?.focus({ preventScroll: true }) // preventScroll: 펼침 애니메이션 중 스크롤 점프 방지
    }
  }, [expanded])

  const collapse = () => {
    setText('')
    setImportant(false)
    setExpanded(false)
  }

  const submit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, important)
    setText('')
    setImportant(false)
    // 열린 채 유지 → 연속 입력. 높이·포커스 원상복구
    requestAnimationFrame(() => {
      autoResize()
      editRef.current?.focus({ preventScroll: true })
    })
  }

  return (
    <div className="todo-input-form">
      {/* 접힘: "+ 일정 추가" — 펼치면 위로 접히며 사라짐 */}
      <div
        className={
          'todo-input-form__fold' +
          (expanded ? '' : ' todo-input-form__fold--open')
        }
      >
        <div className="todo-input-form__clip">
          <button
            type="button"
            className="todo-input-form__trigger"
            tabIndex={expanded ? -1 : 0}
            onClick={() => setExpanded(true)}
          >
            <Plus size={14} /> 일정 추가
          </button>
        </div>
      </div>

      {/* 펼침: 아래로 펼쳐지는 할일 행 */}
      <div
        className={
          'todo-input-form__fold' +
          (expanded ? ' todo-input-form__fold--open' : '')
        }
        aria-hidden={!expanded}
      >
        <div className="todo-input-form__clip">
          <form
            className="todo-input-form__row"
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <span className="todo-input-form__box" aria-hidden />

            <textarea
              ref={editRef}
              className="todo-input-form__edit"
              rows={1}
              value={text}
              tabIndex={expanded ? 0 : -1}
              onChange={(e) => {
                setText(e.target.value)
                autoResize()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault() // Enter=추가 (줄바꿈 삽입 안 함)
                  submit()
                }
                if (e.key === 'Escape') collapse()
              }}
              onBlur={() => {
                if (!text.trim()) collapse() // 빈 채로 벗어나면 접힘
              }}
            />

            {/* 할일 아이템의 (숨겨진) 삭제 버튼 자리만큼 폭 확보 → 별표가 아이템처럼 맨 오른쪽 끝에 오고 크기도 동일 */}
            <span className="todo-input-form__delete-spacer" aria-hidden />

            <button
              type="button"
              className={
                'todo-input-form__star' +
                (important ? ' todo-input-form__star--on' : '')
              }
              tabIndex={expanded ? 0 : -1}
              aria-pressed={important}
              aria-label={important ? '중요 해제' : '중요 일정으로 추가'}
              onMouseDown={(e) => {
                e.preventDefault() // 클릭해도 textarea가 blur(접힘)되지 않도록
                setImportant((v) => !v)
              }}
            >
              <Star size={14} fill={important ? 'currentColor' : 'none'} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TodoInputForm
