import { useState } from 'react';
import './ActivityBar.css';
import { ListChecks, Calendar, NotebookPen } from 'lucide-react';

type TabType = 'todo' | 'calendar' | 'memo';

function ActivityBar() {
  const [activeTab, setActiveTab] = useState<TabType>('todo');

  return (
    <nav className="activity-bar" aria-label="메인 내비게이션">
      <button 
        type="button"
        className={`activity-bar__button ${activeTab === 'todo' ? 'is-active' : ''}`}
        onClick={() => setActiveTab('todo')}
        aria-label="할 일 목록"
      >
        <ListChecks size={22} strokeWidth={1.75} />
      </button>

      <button 
        type="button"
        className={`activity-bar__button ${activeTab === 'calendar' ? 'is-active' : ''}`}
        onClick={() => setActiveTab('calendar')}
        aria-label="캘린더"
      >
        <Calendar size={22} strokeWidth={1.75} />
      </button>

      <button 
        type="button"
        className={`activity-bar__button ${activeTab === 'memo' ? 'is-active' : ''}`}
        onClick={() => setActiveTab('memo')}
        aria-label="메모장"
      >
        <NotebookPen size={22} strokeWidth={1.75} />
      </button>
    </nav>
  );
}

export default ActivityBar;