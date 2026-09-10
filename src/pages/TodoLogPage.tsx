import ActivityBar from '../components/ActivityBar/ActivityBar'
import TodoDrawer from '../components/TodoDrawer/TodoDrawer'
import MainContent from '../components/MainContent/MainContent'
import useUiStore from '../store/useUiStore'
import './TodoLogPage.css'

function TodoLogPage() {
  // 드로어 열림·메인 뷰는 캘린더 화면·카테고리 바에서도 읽으므로 store에서 가져온다
  const isTodoDrawerOpen = useUiStore((s) => s.isTodoDrawerOpen)
  const mainView = useUiStore((s) => s.mainView)
  const toggleTodoDrawer = useUiStore((s) => s.toggleTodoDrawer)
  const setMainView = useUiStore((s) => s.setMainView)

  return (
    <div className="todo-log-page">
      <ActivityBar
        isTodoDrawerOpen={isTodoDrawerOpen}
        mainView={mainView}
        onToggleTodoDrawer={toggleTodoDrawer}
        onSelectMainView={setMainView}
      />
      <TodoDrawer isOpen={isTodoDrawerOpen} />
      <MainContent mode={mainView} />
    </div>
  )
}

export default TodoLogPage
