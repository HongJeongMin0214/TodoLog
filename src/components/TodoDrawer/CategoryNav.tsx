import { useState, useRef, useEffect } from 'react'
import './CategoryNav.css'
import type { Category } from '../../types/todo'
import { DEFAULT_CATEGORY_ID, DEFAULT_CATEGORY_COLOR } from '../../store/useCategoryStore'
import { X } from 'lucide-react'
import ColorPalette from './ColorPalette'

interface CategoryNavProps {
  categories: Category[]
  selectedId: string // "all" 또는 category.id
  onSelect: (id: string) => void
  onAddCategory: (name: string, color: string) => Category | null
  onRenameCategory: (id: string, name: string) => void
  onSetColor: (id: string, color: string) => void
  onRequestDelete: (id: string) => void // 삭제 확인 대화상자를 띄우도록 부모에 요청
}

// 색상 팝오버가 누구를 위해, 어디에 떠야 하는지 (left/top은 .category-nav 기준 상대 좌표)
interface ColorPickerState {
  target: 'add' | string // 'add' = 추가 중인 새 카테고리, 그 외 = category.id
  left: number
  top: number
}

function CategoryNav({
  categories,
  selectedId,
  onSelect,
  onAddCategory,
  onRenameCategory,
  onSetColor,
  onRequestDelete,
}: CategoryNavProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [pendingColor, setPendingColor] = useState(DEFAULT_CATEGORY_COLOR) // 추가 중인 카테고리에 적용할 색
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [colorPicker, setColorPicker] = useState<ColorPickerState | null>(null)
  const containerRef = useRef<HTMLDivElement>(null) // .category-nav(스크롤 안 되는 바깥 요소) — 팝오버 위치의 기준점
  const navRef = useRef<HTMLDivElement>(null) // useRef: 화면에 있는 HTMML 요소를 직접 가리키거나(참조), 화면이 다시 그려져도 사라지지 않는 기억 공간을 만들 때 사용.
  const dragRef = useRef({ moved: false }) // 드래그로 3px 이상 움직였는지 (클릭 취소 판단용)

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

  // 카테고리 바를 가로로 스크롤하면 열려있던 색상 팝오버는 트리거 위치가 어긋나므로 닫음
  useEffect(() => {
    const el = navRef.current
    if (!el || !colorPicker) return
    const onScroll = () => setColorPicker(null)
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [colorPicker])

  // 드래그로 카테고리 바 가로 스크롤
  const onPointerDown = (e: React.PointerEvent) => { // onPointerDown: 마우스 왼쪽 버튼을 누른 순간에 발생하는 이벤트. (mousedown과 유사)
    if (e.button !== 0) return // 마우스 왼쪽 버튼이 아니면 무시
    if ((e.target as HTMLElement).closest('input')) return // 이름 편집 input 위에서는 무시
    const el = navRef.current
    if (!el) return // navRef가 아직 연결되지 않았으면 무시
    const startX = e.clientX // 드래그 시작 시점의 마우스 X 좌표
    const startLeft = el.scrollLeft // 드래그 시작 시점의 스크롤 위치
    dragRef.current.moved = false // 드래그 시작 시점에는 아직 움직이지 않았으므로 false로 초기화
    // 드래그를 할 때 실행되는 함수
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX // 드래그 시작 시점과 현재 마우스 X 좌표 차이
      if (Math.abs(dx) > 3) dragRef.current.moved = true // 드래그로 3px 이상 움직였으면 클릭 취소
      el.scrollLeft = startLeft - dx // 드래그 시작 시점의 스크롤 위치에서 마우스 이동 거리만큼 빼서 스크롤 위치를 갱신. 마우스를 오른쪽으로 움직이면 dx>0이므로 scrollLeft는 작아져서 왼쪽으로 스크롤됨.
    }
    // 드래그 끝나면 이벤트 리스너 제거
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    // 드래그 이벤트 리스너 추가
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // 드래그였으면 그 클릭(카테고리 선택)은 취소
  const onClickCapture = (e: React.MouseEvent) => { // MouseEvent: 마우스 이벤트. onClickCapture: 클릭 이벤트가 부모로 전파되기 전에 먼저 실행되는 이벤트
    if (dragRef.current.moved) {
      e.stopPropagation() // 클릭 이벤트가 부모로 전파되는 것을 막음. (카테고리 선택 취소)
      e.preventDefault()
      dragRef.current.moved = false
    }
  }

  // 색상 원형 버튼 클릭: 이미 그 대상으로 열려있으면 닫고, 아니면 그 버튼 바로 아래에 염
  // (이벤트 핸들러 안이라 ref.current를 읽어도 안전 — 렌더 중엔 읽으면 안 됨)
  const toggleColorPicker = (target: string, triggerEl: HTMLElement) => {
    setColorPicker((cur) => {
      if (cur?.target === target) return null // 이미 선택되어 있는 색상을 한번 더 누르면 팝오버 닫힘.
      const containerRect = containerRef.current?.getBoundingClientRect() // getBoundingClientRect: 브라우저 화면을 기준으로 해당 요소의 사각형 영역 크기와 위치 정보를 반한함.
      if (!containerRect) return null
      const triggerRect = triggerEl.getBoundingClientRect()
      return {
        target,
        left: triggerRect.left - containerRect.left, // triggerRect.lef: 버튼의 왼쪽 끝 좌표. containerRect.left: 부모 상자의 왼쪽 끝 좌표.
        top: triggerRect.bottom - containerRect.top + 4, // triggerRect.bottom: 브라우저 맨 위에서부터 버튼의 아래쪽 끝까지 거리. containerRect.top: 브라우저 맨 위에서부터 부모 상자의 '위쪽 끝'까지 거리.
      }
    })
  }

  const cancelAdd = () => {
    setAdding(false)
    setName('')
    setPendingColor(DEFAULT_CATEGORY_COLOR) // 추가를 위해 선택했던 색상을 기본값으로 되돌림.
    setColorPicker((cur) => (cur?.target === 'add' ? null : cur)) // 현재 열려 있는 컬러 픽커의 대상이 추가 버튼이면 컬러 픽커를 닫고, 다른 곳에서 연 컬러 픽커라면 그대로 유지.
  }

  const commitAdd = () => {
    const created = onAddCategory(name, pendingColor)
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
    setColorPicker((cur) => (cur && cur.target === editingId ? null : cur)) // 현재 열려 있는 컬러 픽커의 대상이 지금 수정 중이던 카테고리 아이디와 같으면 null, 다른 곳에서 열린 픽커면 그대로 유지.
  }

  const commitEdit = () => {
    if (editingId) onRenameCategory(editingId, editName)
    cancelEdit()
  }

  // 지금 열려있는 팝오버가 적용할 색 / 선택 콜백 (추가 중인 새 카테고리 vs 기존 카테고리 수정)
  const colorPickerValue =
    colorPicker?.target === 'add'
      ? pendingColor
      : categories.find((c) => c.id === colorPicker?.target)?.color ?? DEFAULT_CATEGORY_COLOR
  const handleColorSelect = (color: string) => {
    if (!colorPicker) return
    if (colorPicker.target === 'add') setPendingColor(color)
    else onSetColor(colorPicker.target, color)
  }

  return (
    <div className="category-nav" ref={containerRef}>
      <div
        className="category-nav__scroll"
        ref={navRef}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
      >
        <button
          type="button"
          className={selectedId === 'all' ? 'category-nav__tab--active' : ''}
          onClick={() => onSelect('all')}
        >
          전체
        </button>

        {categories.map((category) =>
          editingId === category.id ? ( // 현재 편집 중인 카테고리면 input + 색상 버튼 + 삭제 버튼 표시
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
              <button
                type="button"
                className="category-nav__color"
                style={{ background: category.color ?? DEFAULT_CATEGORY_COLOR }}
                aria-label="카테고리 색상 변경"
                onMouseDown={(e) => e.preventDefault()} // input의 onBlur(취소)를 막음
                // ColorPalette는 document의 pointerdown으로 바깥클릭을 감지하므로, 같은 이벤트를
                // 여기서 멈춰야 "다시 클릭해서 닫기"가 꼬이지 않음(mousedown을 멈춰도 pointerdown엔 안 먹힘)
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => toggleColorPicker(category.id, e.currentTarget)}
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
                  <X size={14} />
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
          <span className="category-nav__edit">
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
            <button
              type="button"
              className="category-nav__color"
              style={{ background: pendingColor }}
              aria-label="카테고리 색상 선택"
              onMouseDown={(e) => e.preventDefault()} // input의 onBlur(취소)를 막음
              onPointerDown={(e) => e.stopPropagation()} // ColorPalette 바깥클릭 감지용 pointerdown 차단
              onClick={(e) => toggleColorPicker('add', e.currentTarget)}
            />
          </span>
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

      {colorPicker && (
        <div
          className="category-nav__color-picker-anchor"
          style={{ left: colorPicker.left, top: colorPicker.top }}
        >
          <ColorPalette
            value={colorPickerValue}
            onSelect={handleColorSelect}
            onClose={() => setColorPicker(null)}
          />
        </div>
      )}
    </div>
  )
}

export default CategoryNav
