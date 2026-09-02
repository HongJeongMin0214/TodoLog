import { useState } from 'react'
import './CategoryNav.css'
import type { Category } from '../../types/todo'

interface CategoryNavProps {
  categories: Category[]
  selectedId: string // "all" 또는 category.id
  onSelect: (id: string) => void
  onAddCategory: (name: string) => Category | null
}

function CategoryNav({
  categories,
  selectedId,
  onSelect,
  onAddCategory,
}: CategoryNavProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  const cancelAdd = () => {
    setAdding(false)
    setName('')
  }

  const commitAdd = () => {
    const created = onAddCategory(name)
    if (created) onSelect(created.id) // 추가한 카테고리로 바로 전환
    cancelAdd()
  }

  return (
    <div className="category-nav">
      <button
        type="button"
        className={selectedId === 'all' ? 'category-nav__tab--active' : ''}
        onClick={() => onSelect('all')}
      >
        전체
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={
            selectedId === category.id ? 'category-nav__tab--active' : ''
          }
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </button>
      ))}

      {adding ? (
        <input
          className="category-nav__add-input"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitAdd()
            if (e.key === 'Escape') cancelAdd()
          }}
          onBlur={cancelAdd}
          placeholder="카테고리"
        />
      ) : (
        <button
          type="button"
          className="category-nav__add"
          onClick={() => setAdding(true)}
          aria-label="카테고리 추가"
        >
          +
        </button>
      )}
    </div>
  )
}

export default CategoryNav
