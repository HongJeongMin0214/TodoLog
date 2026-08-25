interface TodayDateItemProps {
  onClick: () => void
}

function TodayDateItem({ onClick }: TodayDateItemProps) {
  const today = new Date()
  const label = today.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })

  return (
    <button type="button" className="today-date-item" onClick={onClick}>
      {label}
    </button>
  )
}

export default TodayDateItem
