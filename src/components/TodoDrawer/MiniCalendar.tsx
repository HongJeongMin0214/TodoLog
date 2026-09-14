import './MiniCalendar.css'
import { toDateKey, todayKey, getCalendarDays, WEEKDAYS_KO } from '../../lib/date'

interface MiniCalendarProps {
  selected: string // "YYYY-MM-DD"
  onSelect: (dateKey: string) => void
  // "지금 보고 있는 달": store에서 내려받음 (캘린더 화면과 공유 → 한쪽에서 달을 넘기면 다른 쪽도 같이 움직임)
  viewedYear: number
  viewedMonth: number // 0-based
  onPrevMonth: () => void
  onNextMonth: () => void
}

function MiniCalendar({
  selected,
  onSelect,
  viewedYear,
  viewedMonth,
  onPrevMonth,
  onNextMonth,
}: MiniCalendarProps) {
  const days = getCalendarDays(viewedYear, viewedMonth)

  return (
    <div className="mini-calendar">
      <div className="mini-calendar__header">
        <span>{viewedYear}년 {viewedMonth + 1}월</span>
        <div className="mini-calendar__nav">
          <button type="button" onClick={onPrevMonth} aria-label="이전 달">‹</button>
          <button type="button" onClick={onNextMonth} aria-label="다음 달">›</button>
        </div>
      </div>

      <div className="mini-calendar__grid">
        {WEEKDAYS_KO.map((w) => (
          <span key={w} className="mini-calendar__weekday">{w}</span>
        ))}

        {days.map((d) => {
          const key = toDateKey(d) // "YYYY-MM-DD" 형태의 문자열. d는 Date 객체이므로 toDateKey로 변환해야 함
          const classes = [
            'mini-calendar__day',
            d.getMonth() === viewedMonth ? '' : 'mini-calendar__day--outside',
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