import { useState } from 'react'
import './CalendarPanel.css'
import useSelectionStore from '../../../store/useSelectionStore'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'

// 캘린더 그리드를 일/월/년 중 어떤 단위로 볼지
export type CalendarViewMode = 'day' | 'month' | 'year'
const VIEW_MODE_ORDER: CalendarViewMode[] = ['day', 'month', 'year']

function CalendarPanel() {
  const selectedDate = useSelectionStore((s) => s.selectedDate)

  // "지금 보고 있는 달"은 선택 날짜와 별개 관심사 → 캘린더 화면 내부 상태.
  // 처음 열 때는 선택된 날짜의 달을 보여준다. (MiniCalendar와 같은 패턴)
  const [view, setView] = useState(() => {
    const [y, m] = selectedDate.split('-').map(Number)
    return { year: y, month: m - 1 } // month는 0부터 시작하므로 1을 빼줌
  })

  const goPrev = () =>
    setView(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    )
  const goNext = () =>
    setView(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    )
  const goToday = () => {
    const now = new Date()
    setView({ year: now.getFullYear(), month: now.getMonth() })
  }

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
        year={view.year}
        month={view.month}
        viewMode={viewMode}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        onCycleViewMode={cycleViewMode}
      />
      <CalendarGrid year={view.year} month={view.month} />
    </div>
  )
}

export default CalendarPanel
