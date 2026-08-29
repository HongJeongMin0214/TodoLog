import { useState } from 'react'

interface TodoInputFormProps {
  onAdd: (text: string) => void
}

function TodoInputForm({ onAdd }: TodoInputFormProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
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
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <button type="submit">추가</button>
    </form>
  )
}

export default TodoInputForm