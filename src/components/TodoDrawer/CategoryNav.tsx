import { useState } from 'react'
import './CategoryNav.css'
import type { Category } from '../../types/todo'

interface CategoryNavProps {
  categories: Category[]
  selectedId: string // "all" 또는 category.id
  onSelect: (id: string) => void
  onAddCategory: (name: string) => Category | null
  onRenameCategory: (id: string, name: string) => void
}

function CategoryNav({
  categories,
  selectedId,
  onSelect,
  onAddCategory,
  onRenameCategory,
}: CategoryNavProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const cancelAdd = () => {
    setAdding(false)
    setName('')
  }

  const commitAdd = () => {
    const created = onAddCategory(name)
    if (created) onSelect(created.id) // 추가한 카테고리로 바로 전환
    cancelAdd()
  }

  const startEdit = (id: string, current: string) => { // id: 편집할 카테고리 id, current: 현재 이름            
    setEditingId(id) // 지금 수정할 카테고리의 ID를 기억함. 여기서 editingId에 기존 카테고리의 id가 들어감.
    setEditName(current)  // 현재 이름을 input에 표시
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const commitEdit = () => {
    if (editingId) onRenameCategory(editingId, editName)
    cancelEdit()
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

      {categories.map((category) =>
        editingId === category.id ? ( // 현재 편집 중인 카테고리면 input 표시
          <input
            key={category.id}
            className="category-nav__add-input"
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
            onBlur={cancelEdit} // 포커스가 사라지면 취소
          />
        ) : (
          <button
            key={category.id}
            type="button"
            className={
              selectedId === category.id ? 'category-nav__tab--active' : ''
            }
            onClick={() => onSelect(category.id)}
            onDoubleClick={() => startEdit(category.id, category.name)} // 더블클릭으로 이름 변경
          >
            {category.name}
          </button>
        ),
      )}

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
          onBlur={cancelAdd} // 포커스가 사라지면 취소
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
