import { toDateKey, WEEKDAYS_KO, getCalendarDays } from '../../../lib/date'
import CalendarDateCell from './CalendarDateCell'

interface CalendarGridProps {
  year: number
  month: number // 0-based
}

function CalendarGrid({ year, month }: CalendarGridProps) {
  const days = getCalendarDays(year, month) // 6주 × 7일 = 42칸 (앞뒤 달 일부 포함)
  // days 형태 : [Date, Date, Date, ..., Date] (42개)

  return (
    <div className="calendar-grid">
      <div className="calendar-grid__weekdays">
        {WEEKDAYS_KO.map((w) => (
          <span key={w} className="calendar-grid__weekday">
            {w}
          </span>
        ))}
      </div>

      <div className="calendar-grid__body">
        {days.map((d) => (
          <CalendarDateCell
            key={toDateKey(d)} // key를 만드는 이유는 React가 배열을 렌더링할 때 각 요소를 구분하기 위해 필요. key가 없으면 React는 어떤 요소가 변경되었는지 알 수 없어서 성능이 떨어지고, 의도치 않은 렌더링이 발생할 수 있음.
            date={d}
            inMonth={d.getMonth() === month}
          />
        ))}
      </div>
    </div>
  )
}

export default CalendarGrid
