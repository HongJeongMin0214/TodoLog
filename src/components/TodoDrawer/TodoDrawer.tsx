import { useState } from 'react'
import './TodoDrawer.css'
import useTodos from '../../hooks/useTodos'
import useCategories from '../../hooks/useCategories'
import { todayKey, formatShortDate } from '../../lib/date'
import TodoList from './TodoList'
import TodoInputForm from './TodoInputForm'
import MiniCalendar from './MiniCalendar'
import CategoryNav from './CategoryNav'

// "전체" 탭: 저장되는 카테고리가 아니라 특수 선택 상태
const ALL = 'all'

interface TodoDrawerProps {
  isOpen: boolean
}

function TodoDrawer({ isOpen }: TodoDrawerProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() => todayKey())
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(ALL)
  const { getTodos, addTodo, toggleTodo, removeTodo } = useTodos()
  const { categories, addCategory } = useCategories()

  const todos = getTodos(selectedDate)

  // "전체"면 모든 카테고리, 아니면 선택한 카테고리 하나만
  const visibleCategories =
    selectedCategoryId === ALL
      ? categories
      : categories.filter((c) => c.id === selectedCategoryId)

  return (
    <aside
      className={`todo-drawer ${isOpen ? '' : 'todo-drawer--collapsed'}`}
      aria-hidden={!isOpen}
    >
      <div className="todo-drawer__inner">
        <div className="todo-drawer__date">
          <span>{formatShortDate(selectedDate)}</span>
          {selectedDate === todayKey() && (
            <span className="todo-drawer__today">오늘</span>
          )}
        </div>

        <CategoryNav
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          onAddCategory={addCategory}
        />

        {visibleCategories.map((category) => (
          <section key={category.id} className="todo-drawer__category">
            <h3 className="todo-drawer__category-name">{category.name}</h3>
            <TodoList
              todos={todos.filter((t) => t.categoryId === category.id)}
              onToggle={(id) => toggleTodo(selectedDate, id)}
              onRemove={(id) => removeTodo(selectedDate, id)}
            />
            <TodoInputForm
              onAdd={(text) => addTodo(selectedDate, category.id, text)}
            />
          </section>
        ))}

        <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />
      </div>
    </aside>
  )
}

export default TodoDrawer