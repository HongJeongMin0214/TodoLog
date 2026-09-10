import { useState } from 'react'
import { Star } from 'lucide-react'
import './TodoInputForm.css'

interface TodoInputFormProps {
  onAdd: (text: string, important: boolean) => void
}

function TodoInputForm({ onAdd }: TodoInputFormProps) {
  const [text, setText] = useState('')
  const [important, setImportant] = useState(false)

  const handleSubmit = (e: React.SubmitEvent) => { //폼 제출 시 일어난 사건(이벤트 정보)을 변수 e라는 이름으로 받아옴
    e.preventDefault()          // 페이지 새로고침 막기
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, important)
    setText('')                 // 입력창 비우기
    setImportant(false)         // 별표도 초기화
  }

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <div className="todo-input-form__field">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)} // e.target: 이벤트가 발생한 해당 입력창 태그(input) 자체
          onBlur={() => {
            setText('') // 제출 안 하고 딴 곳 클릭하면 입력값 초기화 (placeholder 다시 보이게)
            setImportant(false)
          }}
          placeholder=" + 일정 추가"
        />

        <button
          type="button"
          className={
            'todo-input-form__star' +
            (important ? ' todo-input-form__star--on' : '')
          }
          aria-pressed={important}
          aria-label={important ? '중요 해제' : '중요 일정으로 추가'}
          onMouseDown={(e) => {
            e.preventDefault() // 별표 클릭했을 떄 입력창 닫히지 않게 함
            setImportant((v) => !v)
          }}
        >
          <Star size={16} fill={important ? 'currentColor' : 'none'} />
        </button>
      </div>
    </form>
  )
}

export default TodoInputForm
