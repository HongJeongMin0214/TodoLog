import DateTodoPanelHeader from './DateTodoPanelHeader'
import TodoList from './TodoList'
import TodoInputForm from './TodoInputForm'

function DateTodoPanel() {
  return (
    <section className="date-todo-panel">
      <DateTodoPanelHeader />
      <TodoList />
      <TodoInputForm />
    </section>
  )
}

export default DateTodoPanel
