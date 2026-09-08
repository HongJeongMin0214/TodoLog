import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CalendarViewMode } from './CalendarPanel'

interface CalendarHeaderProps {
  year: number
  month: number // 0-based
  viewMode: CalendarViewMode
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onCycleViewMode: () => void
}

const VIEW_MODE_LABEL: Record<CalendarViewMode, string> = {
  day: '일',
  month: '월',
  year: '년',
}

function CalendarHeader({
  year,
  month,
  viewMode,
  onPrev,
  onNext,
  onToday,
  onCycleViewMode,
}: CalendarHeaderProps) {
  const now = new Date()
  const todayLabel = `${now.getMonth() + 1}/${now.getDate()}` // 예: "9/8"

  return (
    <header className="calendar-header">
      {/* 가운데: 이전 달 ‹ · 연월 · › 다음 달 */}
      <div className="calendar-header__month">
        <button type="button" onClick={onPrev} aria-label="이전 달">
          <ChevronLeft size={18} />
        </button>
        <strong className="calendar-header__title">
          {year}년 {month + 1}월
        </strong>
        <button type="button" onClick={onNext} aria-label="다음 달">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 오른쪽: 보기 단위 · 오늘 날짜 */}
      <div className="calendar-header__nav">
        <button
          type="button"
          className="calendar-header__mode"
          onClick={onCycleViewMode}
          aria-label="보기 단위 변경 (일/월/년)"
        >
          {VIEW_MODE_LABEL[viewMode]}
        </button>
        <button
          type="button"
          className="calendar-header__today"
          onClick={onToday}
        >
          {todayLabel}
        </button>
      </div>
    </header>
  )
}

export default CalendarHeader
