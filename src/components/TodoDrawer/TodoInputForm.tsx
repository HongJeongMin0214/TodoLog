import { useLayoutEffect, useState } from 'react'
import { Plus, Star } from 'lucide-react'
import useAutoGrowTextarea from '../../hooks/useAutoGrowTextarea'
import './TodoInputForm.css'

interface TodoInputFormProps {
  onAdd: (text: string, important: boolean) => void
}

function TodoInputForm({ onAdd }: TodoInputFormProps) {
  const [expanded, setExpanded] = useState(false) // expanded: 펼쳐짐 여부
  const [text, setText] = useState('')
  const [important, setImportant] = useState(false)
  const { ref: editRef, resize: autoResize } = useAutoGrowTextarea()

  useLayoutEffect(() => { // DOM 변경이 완료된 직후 브라우저가 화면을 그리기 전에 동기적으로 실행됨. 화면 그리기 저 미리 레이아웃을 보정하여 깜빢임 막을 수 있음.
    if (expanded) {
      autoResize()
      // ?.: null, undifined이면 undifined 반환
      // preventScroll: 포커스 줄 때, 브라우저가 자동으로 스크롤 움직여 해당 요소가 보이게 화면이 덜컹이며 이동하는 걸 방지함.
      editRef.current?.focus({ preventScroll: true })
    }
  }, [expanded, autoResize, editRef])

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
    // requestAnimationFrame(): 화면을 다음번에 다시 그리기 직전에 전달받은 함수를 실행하도록 예약하는 API.
    // 컴포넌트 상태가 바뀌거나 입력이 일어난 직후에 DOM의 높이를 재거나 포커스 주려하면, 화면을 완전히 게산하기 전이라 타이밍 어긋남.
    // requestAnimationFrame로 감싸면 브라우저가 레이아웃 배치를 마친 후 다음 화면 그리기 직전(안전)에 높이 조절과 포커스 이동이 실행됨.
    // 따라서 연속 텍스트 입력과 편집 상태 유지 시 화면 덜컹이거나 멈추는 현상 방지. 
    requestAnimationFrame(() => {
      autoResize()
      editRef.current?.focus({ preventScroll: true })
    })
  }

  return (
    <div
      className={'todo-input-form' + (expanded ? ' todo-input-form--expanded' : '')}
    >
      {/* 접힘: "+ 일정 추가" 트리거. 펼치면 위로 접히며 사라짐 */}
      <div className="todo-input-form__fold todo-input-form__fold--trigger">
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
        className="todo-input-form__fold todo-input-form__fold--row"
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
                // 입력창 밖을 클릭해 벗어나면: 내용 있으면 저장, 없으면 그냥 접힘
                // (포커스가 이미 다른 곳으로 옮겨간 뒤라 submit()과 달리 다시 포커스를 뺏지 않음)
                const trimmed = text.trim()
                if (trimmed) onAdd(trimmed, important)
                collapse()
              }}
            />

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
