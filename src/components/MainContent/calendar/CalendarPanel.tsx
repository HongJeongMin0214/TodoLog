import { useState } from 'react'
import './CalendarPanel.css'
import useSelectionStore from '../../../store/useSelectionStore'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'

// 캘린더 그리드를 일/월/년 중 어떤 단위로 볼지
export type CalendarViewMode = 'day' | 'month' | 'year'
const VIEW_MODE_ORDER: CalendarViewMode[] = ['day', 'month', 'year']

function CalendarPanel() {
  // "지금 보고 있는 달"은 store에 둬서 드로어의 MiniCalendar와 동기화된다 (한쪽에서 달을 넘기면 다른 쪽도 같이 움직임)
  const year = useSelectionStore((s) => s.viewedYear)
  const month = useSelectionStore((s) => s.viewedMonth)
  const goPrev = useSelectionStore((s) => s.goToPrevMonth)
  const goNext = useSelectionStore((s) => s.goToNextMonth)
  const goToday = useSelectionStore((s) => s.goToToday) // 선택 날짜 + 보는 달을 함께 오늘로

  // 일 → 월 → 년 → 일 순으로 순환. 기본값은 월.
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month')
  const cycleViewMode = () =>
    setViewMode(
      (m) =>
        VIEW_MODE_ORDER[
          (VIEW_MODE_ORDER.indexOf(m) + 1) % VIEW_MODE_ORDER.length
        ],
    )

  return (
    <div className="calendar-panel">
      <CalendarHeader
        year={year}
        month={month}
        viewMode={viewMode}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        onCycleViewMode={cycleViewMode}
      />
      <CalendarGrid year={year} month={month} />
    </div>
  )
}

export default CalendarPanel
