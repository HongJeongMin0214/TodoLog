import { useState, useRef, useEffect } from 'react'
import './CategoryNav.css'
import type { Category } from '../../types/todo'
import { DEFAULT_CATEGORY_ID } from '../../hooks/useCategories'

interface CategoryNavProps {
  categories: Category[]
  selectedId: string // "all" 또는 category.id
  onSelect: (id: string) => void
  onAddCategory: (name: string) => Category | null
  onRenameCategory: (id: string, name: string) => void
  onRequestDelete: (id: string) => void // 삭제 확인 대화상자를 띄우도록 부모에 요청
}

function CategoryNav({
  categories,
  selectedId,
  onSelect,
  onAddCategory,
  onRenameCategory,
  onRequestDelete,
}: CategoryNavProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const navRef = useRef<HTMLDivElement>(null)

  // 세로 마우스 휠 → 카테고리 바 가로 스크롤
  useEffect(() => {
    const el = navRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return 
      if (el.scrollWidth <= el.clientWidth) return // 넘칠 때만 소비
      e.preventDefault() // 세로 스크롤 막기
      el.scrollLeft += e.deltaY // 세로로 굴린 휠 값(deltaY)을 가로 스크롤 위치(scrollLegt)에 더해줌. 
    }
    // React onWheel은 passive라 preventDefault가 안 먹으므로 네이티브(addEventlistener)로 등록
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

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
    <div className="category-nav" ref={navRef}>
      <button
        type="button"
        className={selectedId === 'all' ? 'category-nav__tab--active' : ''}
        onClick={() => onSelect('all')}
      >
        전체
      </button>

      {categories.map((category) =>
        editingId === category.id ? ( // 현재 편집 중인 카테고리면 input + 삭제 버튼 표시
          <span key={category.id} className="category-nav__edit">
            <input
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
            {category.id !== DEFAULT_CATEGORY_ID && (
              <button
                type="button"
                className="category-nav__delete"
                aria-label="카테고리 삭제"
                // mousedown에서 preventDefault: input의 onBlur(취소)가 먼저 실행되는 것을 막음
                onMouseDown={(e) => {
                  // 삭제 버튼이 input 밖에 있기 때문에 input의 onBlur가 먼저 발동해 삭제 버튼이 사라지는 것을 방지
                  // (preventDefault로 포커스 유출을 막아 onRequestDelete가 정상 실행되도록 보장)
                  e.preventDefault()
                  onRequestDelete(category.id)
                  cancelEdit()
                }}
              >
                ×
              </button>
            )}
          </span>
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
