import './TodoDrawer.css'

interface TodoDrawerProps {
  isOpen: boolean
}

function TodoDrawer({ isOpen }: TodoDrawerProps) {
  return (
    <aside
      className={`todo-drawer ${isOpen ? '' : 'todo-drawer--collapsed'}`}
      aria-hidden={!isOpen}
    >
      {/* 폭이 0으로 줄어드는 동안 안쪽 내용이 찌그러지지 않도록 고정폭 래퍼로 감쌈 */}
      <div className="todo-drawer__inner">
        <p>할 일 목록 영역</p>
      </div>
    </aside>
  )
}

export default TodoDrawer
