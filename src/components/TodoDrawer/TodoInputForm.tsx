import { useState } from 'react'
import './TodoInputForm.css'

interface TodoInputFormProps {
  onAdd: (text: string) => void
}

function TodoInputForm({ onAdd }: TodoInputFormProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => { //폼 제출 시 일어난 사건(이벤트 정보)을 변수 e라는 이름으로 받아옴
    e.preventDefault()          // 폼 기본 새로고침 막기
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')                 // 입력창 비우기
  }

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)} // e.target: 이벤트가 발생한 해당 입력창 태그(input) 자체
        placeholder=" + 할 일 추가"
      />
    </form>
  )
}

export default TodoInputForm