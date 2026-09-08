import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './CompletedSection.css'
import type { Category, Todo } from '../../types/todo'
import TodoList from './TodoList'

interface CompletedSectionProps {
  categories: Category[] // 현재 보이는 카테고리들
  todos: Todo[] // 선택한 날짜의 전체 할 일
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

function CompletedSection({
  categories,
  todos,
  onToggle,
  onRemove,
}: CompletedSectionProps) {
  const [open, setOpen] = useState(false)

  // 보이는 카테고리에 속한 완료 할 일만 (개수 표시와 펼친 내용이 일치하도록)
  const visibleIds = new Set(categories.map((c) => c.id))
  const done = todos.filter((t) => t.done && visibleIds.has(t.categoryId))

  // 보이는 카테고리 순서대로, 완료 항목이 있는 것만 (입력 순서 유지)
  const groups = categories
    .map((c) => ({
      category: c,
      items: done.filter((t) => t.categoryId === c.id),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="completed-section">
      <button
        type="button"
        className="completed-section__bar"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="completed-section__title">완료 {done.length}</span>
        <ChevronDown
          size={16}
          className={`completed-section__chevron ${open ? 'is-open' : ''}`}
        />
      </button>

      {open && (
        <div className="completed-section__body">
          {groups.map(({ category, items }) => (
            <div key={category.id} className="completed-section__group">
              <h4 className="completed-section__group-name">{category.name}</h4>
              <TodoList todos={items} onToggle={onToggle} onRemove={onRemove} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CompletedSection
