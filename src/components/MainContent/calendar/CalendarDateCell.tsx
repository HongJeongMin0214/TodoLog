import { toDateKey, todayKey } from '../../../lib/date'
import useSelectionStore from '../../../store/useSelectionStore'

interface CalendarDateCellProps {
  date: Date
  inMonth: boolean // 이번 달 날짜인지 (앞뒤 달 칸은 흐리게)
}

function CalendarDateCell({ date, inMonth }: CalendarDateCellProps) {
  const key = toDateKey(date)
  const selectedDate = useSelectionStore((s) => s.selectedDate)
  const setSelectedDate = useSelectionStore((s) => s.setSelectedDate)

  const classes = [
    'calendar-date-cell',
    inMonth ? '' : 'calendar-date-cell--outside',
    key === todayKey() ? 'calendar-date-cell--today' : '',
    key === selectedDate ? 'calendar-date-cell--selected' : '',
  ]
    .join(' ')
    .trim()

  return (
    <button type="button" className={classes} onClick={() => setSelectedDate(key)}>
      <span className="calendar-date-cell__num">{date.getDate()}</span>
    </button>
  )
}

export default CalendarDateCell
