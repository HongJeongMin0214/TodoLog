import './ActivityBar.css';
import { CircleCheckBig , Calendar, NotebookPen } from 'lucide-react';

type MainView = 'calendar' | 'memo';

interface ActivityBarProps {
  isTodoDrawerOpen: boolean;
  mainView: MainView;
  onToggleTodoDrawer: () => void;
  onSelectMainView: (view: MainView) => void;
}

function ActivityBar({
  isTodoDrawerOpen,
  mainView,
  onToggleTodoDrawer,
  onSelectMainView,
}: ActivityBarProps) {
  return (
    <nav className="activity-bar" aria-label="메인 내비게이션">
      <button
        type="button"
        className={`activity-bar__button ${isTodoDrawerOpen ? 'is-active' : ''}`}
        onClick={onToggleTodoDrawer}
        aria-label="할 일 목록"
        aria-pressed={isTodoDrawerOpen}
      >
        <CircleCheckBig size={22} strokeWidth={1.75} />
      </button>

      <button
        type="button"
        className={`activity-bar__button ${mainView === 'calendar' ? 'is-active' : ''}`}
        onClick={() => onSelectMainView('calendar')}
        aria-label="캘린더"
        aria-pressed={mainView === 'calendar'}
      >
        <Calendar size={22} strokeWidth={1.75} />
      </button>

      <button
        type="button"
        className={`activity-bar__button ${mainView === 'memo' ? 'is-active' : ''}`}
        onClick={() => onSelectMainView('memo')}
        aria-label="메모장"
        aria-pressed={mainView === 'memo'}
      >
        <NotebookPen size={22} strokeWidth={1.75} />
      </button>
    </nav>
  );
}

export default ActivityBar;
