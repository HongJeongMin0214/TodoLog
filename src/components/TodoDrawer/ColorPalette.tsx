import { useEffect, useRef } from 'react'
import { CATEGORY_COLORS } from '../../store/useCategoryStore'
import './ColorPalette.css'

interface ColorPaletteProps {
  value: string // 현재 선택된 색 (스와치에 표시 체크용)
  onSelect: (color: string) => void
  onClose: () => void
}

// 트리거(원형 버튼) 아래에 뜨는 팝오버. 카테고리 수정/추가 양쪽에서 재사용.
// 위치는 부모가 position:relative를 잡아주고 여기선 position:absolute만 씀.
function ColorPalette({ value, onSelect, onClose }: ColorPaletteProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 팝오버 바깥을 클릭하거나 Esc를 누르면 닫기
    const onPointerDown = (e: PointerEvent) => {
      // ref.curren: ref.current가 존재할 때. ref.current.contains: 특정 요소가 자식에 포함되어 있는지. e.target as Node: 이벤트가 실제로 발생한 대상을 DOM의 Node타입으로 형변환 함.
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className="color-palette" ref={ref} role="listbox" aria-label="카테고리 색상 선택">
      {CATEGORY_COLORS.map(({ name, value: color }) => (
        <button
          key={color}
          type="button"
          className={
            'color-palette__swatch' +
            (color === value ? ' color-palette__swatch--selected' : '')
          }
          style={{ background: color }}
          aria-label={name}
          aria-selected={color === value}
          // preventDefault: 스와치 클릭 시 포커스가 이동해 카테고리 이름 input이 blur(취소)되는 것을 막음
          // (막지 않으면 blur로 편집/추가 모드가 먼저 닫히면서 이 버튼도 같이 사라져 onClick이 실행되지 않음)
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            onSelect(color)
            onClose()
          }}
        />
      ))}
    </div>
  )
}

export default ColorPalette
