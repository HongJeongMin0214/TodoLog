import { useState, useRef, useEffect, useLayoutEffect } from 'react'
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

// ColorPalette.css 그리드 실측 폭: 4열×20px + gap(6px)×3 + 좌우 padding(8px)×2 = 114px
// (드로어 밖으로 안 잘리게 팝오버 left를 clamp할 때 사용)
const PALETTE_WIDTH = 114

// 색상 팝오버가 누구를 위해, 어디에 떠야 하는지 (left/top은 .category-nav 기준 상대 좌표)
interface ColorPickerState {
  target: 'add' | string // 'add' = 추가 중인 새 카테고리, 그 외 = category.id
  left: number
  top: number
}

// 카테고리 이름이 길어 가릴 게 없을 때: finalWidth 100px - startWidth 100px = 0px(또는 글자가 넘쳐서 finalWidth가 더 작을 수도 있음)이면 hidden이 0이라 clipPath가 작동(애니메이션 끝나면 transitionend 이벤트 발생함) 안 할 수 있어서,
// setTimeout으로 0.25초 뒤 무조건 끝냄.
function collapseEditField(el: HTMLElement, startWidth: number, onDone: () => void) {
  let done = false
  const finish = () => {
    if (done) return
    done = true
    el.removeEventListener('transitionend', onTransitionEnd)
    clearTimeout(timer)
    onDone()
  }
  const onTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName === 'clip-path') finish()
  }
  el.addEventListener('transitionend', onTransitionEnd)
  const timer = setTimeout(finish, 250) // transition(0.2s)보다 살짝 여유

  const finalWidth = el.getBoundingClientRect().width
  const hidden = Math.max(0, finalWidth - startWidth) // startWidth: 남기고 싶은 시작 폭
  el.style.clipPath = `inset(0 ${hidden}px 0 0)`
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
  const addWrapRef = useRef<HTMLSpanElement>(null) // "+ 카테고리 추가" 입력칸+색상 버튼 묶음 — 생기자마자 스크롤해서 보이게 함
  const editWrapRef = useRef<HTMLSpanElement>(null) // 수정 중인 입력칸+색상+삭제 버튼 묶음(.category-nav__edit) — 편집 시작하면 스크롤해서 통째로 보이게 함
  const editStartWidthRef = useRef(0) // 편집 진입 직전 눌렀던 탭 버튼의 폭(px) — 여기서부터 편집 필드 폭으로 부드럽게 확장
  const dragRef = useRef({ moved: false }) // 드래그로 3px 이상 움직였는지 (클릭 취소 판단용)

  // 카테고리 추가할 때, 인풋박스와 컬러 픽커 모두 보이게 최소 스크롤 함.
  useLayoutEffect(() => { // 브라우저가 화면을 그리기 직전에 실행. 화면 깜빡임 현상(플래시) 없이 스타일 미리 세팅할 때 사용. 여기서는 adding 값이 바뀔 때(+ 버튼 눌렀을 때) 실행됨.
    const el = addWrapRef.current
    if (!adding || !el) return // 추가 중이 아니거나, el이 아직 없으면 return
    el.style.clipPath = 'inset(0 0 0 0)' // 전부 다 보이는 상태로 설정. clipPath를 0으로 설정하지 않으면, 기본값인 none이 되어, 나중에 닫을 때 none에서 inset(...)로 갑자기 형태 바꾸려고 하면 브라우저는 이걸 애니메이션으로 계산하지 못하고 잠프(뚝 끊김) 시킴.
    el.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' }) // scrollIntoView: 새로 생긴 추가 입력창이 스크롤 영역 밖에 있으면, smooth하게 최소한의 움직임(nearest)로 화면 안으로 밀어 넣어줌
  }, [adding])

  // 편집 시작 시 탭 버튼 폭 → 편집 필드(입력칸+색상+삭제) 폭으로 부드럽게 확장.
  // clip-path로 witdh를 고정하고 오른쪽을 가렸다 푸는 방식으로
  // 스크롤 범위(scrollWidth)가 처음부터 최종 크기로 유지되어 툭 튀는 현상(clamp) 없이 부드럽게 스크롤
  useLayoutEffect(() => {
    const el = editWrapRef.current
    if (!editingId || !el) return
    const finalWidth = el.getBoundingClientRect().width
    const hidden = Math.max(0, finalWidth - editStartWidthRef.current)
    el.style.clipPath = `inset(0 ${hidden}px 0 0)` // edithigId를 변경하면, 화면에 입력칸+컬러차트+삭제버튼(예를들어 150px이면)이 한번에 생성됨. 그래서 생성된 150px를 일단 숨겨 editStartWidthRef(현재 카테고리 이름)만 보이게 함.

    const frame = requestAnimationFrame(() => { // 브라우저가 다음 화면을 그리기 직전에 해당 함수 실행하는 예약 함수. 
    // requestAnimationFrame함수 없이 입력칸+컬러차트+삭제버튼을 숨겼다가 바로 풀어주면 아주 빠르게 한번에 커져 버려서 애니메이션 안 걸림. 
    // 따라서 requestAnimationFrame로 다음 화면 그리기 직전(즉, 한템포 쉬고 나서)에 펼쳐지게.
      el.style.clipPath = 'inset(0 0 0 0)' // 가린 것 없음으로 풀어줌
      el.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [editingId])

  // 세로 마우스 휠 → 카테고리 바 가로 스크롤
  useEffect(() => {
    const el = navRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return
      if (el.scrollWidth <= el.clientWidth) return // scrollWidth: 전체 내용 폭 clientWidth: 지금 화면에 보이는 상자 크기. el.scrollWidth <= el.clientWidt: 카테고리 새구사 적어 화면 밖으로 나간 내용이 없음.
      e.preventDefault() // 세로 스크롤 막기
      el.scrollLeft += e.deltaY // 세로로 굴린 휠 값(deltaY)을 가로 스크롤 위치(scrollLegt)에 더해줌.
    }
    el.addEventListener('wheel', onWheel, { passive: false }) // passive: false로 preventDefault 사용 가능하게
    return () => el.removeEventListener('wheel', onWheel) // removeEventListener은 등록만 해두고 대기 상태로 들어감. useEffect의 return(클린업 함수)는 컴포넌트가 화면에서 완전히 사라질 때 실행됨. 
  }, []) // []: 컴포넌트가 처음 화면에 렌더링될 때 한 번 실행.

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
      e.stopPropagation() // 클릭 이벤트가 부모로 전파되는(이벤트 버블링) 것을 막음. (카테고리 선택 취소)
      e.preventDefault()
      dragRef.current.moved = false
    }
  }

  // 색상 원형 버튼 클릭: 이미 그 대상으로 열려있으면 닫고, 아니면 그 버튼 바로 아래에 염
  // (이벤트 핸들러 안이라 ref.current를 읽어도 안전 — 렌더 중엔 읽으면 안 됨)
  const toggleColorPicker = (target: string, triggerEl: HTMLElement) => {
    setColorPicker((cur) => {
      if (cur?.target === target) return null // 이미 선택되어 있는 팝 오버 대상을 한번 더 누르면 팝오버 닫힘.
      const containerRect = containerRef.current?.getBoundingClientRect() // getBoundingClientRect: 브라우저 화면을 기준으로 해당 요소의 사각형 영역 크기와 위치 정보를 반한함.
      if (!containerRect) return null
      const triggerRect = triggerEl.getBoundingClientRect()
      const rawLeft = triggerRect.left - containerRect.left // triggerRect.left: 버튼의 왼쪽 끝 좌표. containerRect.left: 부모 상자의 왼쪽 끝 좌표.
      // 트리거가 오른쪽 끝 근처에 있으면 팝오버가 .category-nav(=드로어 폭) 밖으로 삐져나가므로,
      // 팝오버 폭만큼 왼쪽으로 당겨서 항상 드로어 안에 들어오게 함
      const maxLeft = Math.max(0, containerRect.width - PALETTE_WIDTH)
      return {
        target,
        left: Math.min(rawLeft, maxLeft), // rawLeft > maxLeft이면 left = maxLeft
        top: triggerRect.bottom - containerRect.top + 4, // triggerRect.bottom: 브라우저 맨 위에서부터 버튼의 아래쪽 끝까지 거리. containerRect.top: 브라우저 맨 위에서부터 부모 상자의 '위쪽 끝'까지 거리.
      }
    })
  }

  // 추가 종료: "+" 버튼 폭만큼만 보이게 접은 뒤, 그제서야 "+" 버튼으로 되돌림
  const cancelAdd = () => {
    setPendingColor(DEFAULT_CATEGORY_COLOR) // 추가를 위해 선택했던 색상을 기본값으로 되돌림.
    setColorPicker((cur) => (cur?.target === 'add' ? null : cur)) // 현재 열려 있는 컬러 픽커의 대상이 추가 버튼이면 컬러 픽커를 닫고, 다른 곳에서 연 컬러 픽커라면 그대로 유지.
    const el = addWrapRef.current
    if (!el) { // 요소를 못 찾으면 애니메이션 없이 바로 종료
      setAdding(false)
      setName('')
      return
    }
    // 0: "+" 버튼 크기에 맞추지 않고 왼쪽으로 끝까지(0폭) 접음 → 다 닫힌 뒤 그 자리에 "+"가 새로 나타남.
    collapseEditField(el, 0, () => {
      setAdding(false)
      setName('')
    })
  }

  const commitAdd = () => {
    const created = onAddCategory(name, pendingColor)
    if (created) onSelect(created.id)
    cancelAdd()
  }

  const startEdit = (id: string, current: string, triggerEl: HTMLElement) => { // id: 편집할 카테고리 id, current: 현재 이름, triggerEl: 더블클릭한 탭 버튼(시작 폭 측정용)
    editStartWidthRef.current = triggerEl.getBoundingClientRect().width
    setEditingId(id) // 지금 수정할 카테고리의 ID를 기억함. 여기서 editingId에 기존 카테고리의 id가 들어감.
    setEditName(current)  // 현재 이름을 input에 표시
  }

  // 편집 종료: 원래 버튼 폭만큼만 보이게 접은 뒤, 편집 모드를 끝냄(버튼으로 교체).
  const cancelEdit = () => {
    const id = editingId
    if (!id) return
    setColorPicker((cur) => (cur && cur.target === id ? null : cur)) // 지금 이 카테고리용으로 열린 컬러 픽커면 같이 닫음
    const el = editWrapRef.current
    if (!el) { // 요소를 못 찾으면 애니메이션 없이 바로 종료
      setEditingId(null)
      setEditName('')
      return
    }
    collapseEditField(el, editStartWidthRef.current, () => {
      setEditingId(null)
      setEditName('')
    })
  }

  const commitEdit = () => {
    if (editingId) onRenameCategory(editingId, editName)
    cancelEdit()
  }

  // 탭 선택 + 화면 밖(스크롤 안 보이는 곳)에 있었을 때만 최소한으로 스크롤해서 보이게 함
  const selectAndReveal = (id: string, el: HTMLElement) => {
    onSelect(id)
    el.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' })
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
          onClick={(e) => selectAndReveal('all', e.currentTarget)}
        >
          전체
        </button>

        {categories.map((category) =>
          editingId === category.id ? ( // 현재 편집 중인 카테고리면 input + 색상 버튼 + 삭제 버튼 표시
            <span key={category.id} className="category-nav__edit" ref={editWrapRef}>
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
              onClick={(e) => selectAndReveal(category.id, e.currentTarget)}
              onDoubleClick={(e) => startEdit(category.id, category.name, e.currentTarget)} // 더블클릭으로 이름 변경
            >
              {category.name}
            </button>
          ),
        )}

        {adding ? (
          <span className="category-nav__edit" ref={addWrapRef}>
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
