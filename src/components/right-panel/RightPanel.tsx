import MemoPanel from './memo/MemoPanel'
import CalendarPanel from './calendar/CalendarPanel'

interface RightPanelProps {
  mode: 'memo' | 'calendar'
}

function RightPanel({ mode }: RightPanelProps) {
  return (
    <section className="right-panel">
      {mode === 'memo' ? <MemoPanel /> : <CalendarPanel />}
    </section>
  )
}

export default RightPanel
