import { useState } from 'react'
import './TodoDrawer.css'
import useTodos from '../../hooks/useTodos'
import useCategories, { DEFAULT_CATEGORY_ID } from '../../hooks/useCategories'
import { todayKey, formatShortDate } from '../../lib/date'
import TodoList from './TodoList'
import TodoInputForm from './TodoInputForm'
import MiniCalendar from './MiniCalendar'
import CategoryNav from './CategoryNav'
import CompletedSection from './CompletedSection'
import DeleteCategoryDialog from './DeleteCategoryDialog'

// "전체" 탭
const ALL = 'all'

interface TodoDrawerProps {
  isOpen: boolean
}

function TodoDrawer({ isOpen }: TodoDrawerProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() => todayKey())
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(ALL)
  // 어떤 카테고리를 삭제할지 기억(pending)해야 함. DeleteCategoryDialog을 띄워 사용자의 선택을 기다려야 하기 때문
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null) // 삭제 확인 대기 중인 카테고리 id (null이면 대화상자 닫힘)
  const {
    getTodos,
    addTodo,
    toggleTodo,
    removeTodo,
    countTodosByCategory,
    deleteTodosByCategory,
    reassignTodosByCategory,
  } = useTodos()
  const { categories, addCategory, renameCategory, removeCategory } =
    useCategories()

  const todos = getTodos(selectedDate)

  // "전체"면 모든 카테고리, 아니면 선택한 카테고리 하나만
  const visibleCategories =
    selectedCategoryId === ALL
      ? categories
      : categories.filter((c) => c.id === selectedCategoryId)

  const pendingCategory = categories.find((c) => c.id === pendingDeleteId)

  // 카테고리 삭제 마무리: 카테고리 제거 + 선택 상태 정리 + 대화상자 닫기
  const finishDelete = (id: string) => {
    removeCategory(id)
    if (selectedCategoryId === id) setSelectedCategoryId(ALL)
    setPendingDeleteId(null) // 삭제 확인 대기 중인 카테고리 id를 null로 바꿔 대화상자 닫기
  }

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
          onRenameCategory={renameCategory}
          onRequestDelete={setPendingDeleteId}
        />

        <div className="todo-drawer__scroll">
          {visibleCategories.map((category) => (
            <section key={category.id} className="todo-drawer__category">
              <h3 className="todo-drawer__category-name">{category.name}</h3>
              <TodoList
                todos={todos.filter(
                  (t) => t.categoryId === category.id && !t.done,
                )}
                onToggle={(id) => toggleTodo(selectedDate, id)}
                onRemove={(id) => removeTodo(selectedDate, id)}
              />
              <TodoInputForm
                onAdd={(text) => addTodo(selectedDate, category.id, text)}
              />
            </section>
          ))}

          <CompletedSection
            categories={visibleCategories}
            todos={todos}
            onToggle={(id) => toggleTodo(selectedDate, id)}
            onRemove={(id) => removeTodo(selectedDate, id)}
          />
        </div>

        <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />
      </div>

      {pendingCategory && (
        <DeleteCategoryDialog
          categoryName={pendingCategory.name}
          todoCount={countTodosByCategory(pendingCategory.id)}
          onDeleteTodos={() => {
            deleteTodosByCategory(pendingCategory.id)
            finishDelete(pendingCategory.id)
          }}
          onMoveTodos={() => {
            reassignTodosByCategory(pendingCategory.id, DEFAULT_CATEGORY_ID)
            finishDelete(pendingCategory.id)
          }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </aside>
  )
}

export default TodoDrawer