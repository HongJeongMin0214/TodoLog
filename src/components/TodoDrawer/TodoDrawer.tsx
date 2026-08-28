import { useState } from 'react'
import './TodoDrawer.css'
import useTodos from '../../hooks/useTodos'
import { todayKey } from '../../lib/date'

interface TodoDrawerProps {
  isOpen: boolean
}

function TodoDrawer({ isOpen }: TodoDrawerProps) {
  const [selectedDate] = useState<string>(() => todayKey()) // 페이지가 처음 렌더링될 때 오늘 날짜를 선택된 날짜로 초기화 (setter는 8단계에서 되살림)
  const { getTodos, addTodo } = useTodos()

  const todos = getTodos(selectedDate)

  return (
    <aside
      className={`todo-drawer ${isOpen ? '' : 'todo-drawer--collapsed'}`}
      aria-hidden={!isOpen}
    >
      <div className="todo-drawer__inner">
        {/* 임시 확인용 — 다음 단계에서 TodoList/MiniCalendar로 교체 */}
        <p>선택 날짜: {selectedDate}</p>
        <p>할 일 {todos.length}개</p>
        {/* 즉시 실행되는 것을 막기 위해 반드시 앞에 () =>를 붙여서 클릭 대기 상태로 포장 */}
        <button type="button" onClick={() => addTodo(selectedDate, '테스트 할 일')}>
          테스트 추가
        </button>
      </div>
    </aside>
  )
}

export default TodoDrawer