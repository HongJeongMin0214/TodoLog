import MemoPanel from './memo/MemoPanel'
import CalendarPanel from './calendar/CalendarPanel'

interface MainContentProps {
  mode: 'memo' | 'calendar'
}

function MainContent({ mode }: MainContentProps) {
  return (
    <section className="right-panel flex-1">
      {mode === 'memo' ? <MemoPanel /> : <CalendarPanel />}
    </section>
  )
}

export default MainContent
