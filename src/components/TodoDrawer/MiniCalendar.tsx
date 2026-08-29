import { useState } from 'react'
import './MiniCalendar.css'
import { toDateKey, todayKey, getCalendarDays } from '../../lib/date'

interface MiniCalendarProps {
  selected: string // "YYYY-MM-DD"
  onSelect: (dateKey: string) => void
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function MiniCalendar({ selected, onSelect }: MiniCalendarProps) {
  // "지금 보고 있는 달"은 선택 날짜와 별개 관심사 → 캘린더 내부 상태
  const [view, setView] = useState(() => { // lazy initializer: 컴포넌트가 처음 랜더링 될 때 한번만 실행.
    const [y, m] = selected.split('-').map(Number) // "YYYY-MM-DD" → [YYYY, MM, DD] → [Number, Number, Number]. 
    return { year: y, month: m - 1 } // month는 0부터 시작하므로 1을 빼줌
  })

  const days = getCalendarDays(view.year, view.month)

  const goPrev = () =>
    setView(({ year, month }) =>
        // month가 0이면 이전 달은 11월, year는 1년 전으로. month가 0이 아니면 그대로 month-1
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    ) 
  const goNext = () =>
    setView(({ year, month }) =>
        // month가 11이면 다음 달은 0월, year는 1년 후로. month가 11이 아니면 그대로 month+1
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    )

  return (
    <div className="mini-calendar">
      <div className="mini-calendar__header">
        <button type="button" onClick={goPrev} aria-label="이전 달">‹</button>
        <span>{view.year}년 {view.month + 1}월</span>
        <button type="button" onClick={goNext} aria-label="다음 달">›</button>
      </div>

      <div className="mini-calendar__grid">
        {WEEKDAYS.map((w) => (
          <span key={w} className="mini-calendar__weekday">{w}</span>
        ))}

        {days.map((d) => {
          const key = toDateKey(d) // "YYYY-MM-DD" 형태의 문자열. d는 Date 객체이므로 toDateKey로 변환해야 함
          const classes = [
            'mini-calendar__day',
            d.getMonth() === view.month ? '' : 'mini-calendar__day--outside',
            key === todayKey() ? 'mini-calendar__day--today' : '',
            key === selected ? 'mini-calendar__day--selected' : '',
          ].join(' ').trim()

          return (
            <button
              key={key}
              type="button"
              className={classes}
              onClick={() => onSelect(key)}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MiniCalendar