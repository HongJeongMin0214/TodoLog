import MemoList from './MemoList'
import MemoEditor from './MemoEditor'

function MemoPanel() {
  return (
    <div className="memo-panel">
      <MemoList />
      <MemoEditor />
    </div>
  )
}

export default MemoPanel
