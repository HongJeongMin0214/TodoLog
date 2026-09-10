import { useState } from 'react'
import './TodoDrawer.css'
import useTodoStore from '../../store/useTodoStore'
import useCategoryStore, {
  DEFAULT_CATEGORY_ID,
} from '../../store/useCategoryStore'
import useSelectionStore, { ALL_CATEGORIES } from '../../store/useSelectionStore'
import { todayKey, formatShortDate } from '../../lib/date'
import TodoList from './TodoList'
import TodoInputForm from './TodoInputForm'
import MiniCalendar from './MiniCalendar'
import CategoryNav from './CategoryNav'
import CompletedSection from './CompletedSection'
import DeleteCategoryDialog from './DeleteCategoryDialog'

interface TodoDrawerProps {
  isOpen: boolean
}

function TodoDrawer({ isOpen }: TodoDrawerProps) {
  // 선택한 날짜는 메인 패널의 캘린더 화면과도 공유하므로 store에서 가져온다
  // (선택 카테고리도 같은 선택 상태라 함께 store에 둠 — 현재는 드로어에서만 사용)
  const selectedDate = useSelectionStore((s) => s.selectedDate)
  const setSelectedDate = useSelectionStore((s) => s.setSelectedDate)
  const selectedCategoryId = useSelectionStore((s) => s.selectedCategoryId)
  const setSelectedCategoryId = useSelectionStore((s) => s.setSelectedCategoryId)
  // 어떤 카테고리를 삭제할지 기억(pending)해야 함. DeleteCategoryDialog을 띄워 사용자의 선택을 기다려야 하기 때문
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null) // 삭제 확인 대기 중인 카테고리 id (null이면 대화상자 닫힘)
  const todosByDate = useTodoStore((s) => s.todosByDate)
  const addTodo = useTodoStore((s) => s.addTodo)
  const toggleTodo = useTodoStore((s) => s.toggleTodo)
  const toggleImportant = useTodoStore((s) => s.toggleImportant)
  const editTodo = useTodoStore((s) => s.editTodo)
  const removeTodo = useTodoStore((s) => s.removeTodo)
  const countTodosByCategory = useTodoStore((s) => s.countTodosByCategory)
  const deleteTodosByCategory = useTodoStore((s) => s.deleteTodosByCategory)
  const reassignTodosByCategory = useTodoStore((s) => s.reassignTodosByCategory)
  const categories = useCategoryStore((s) => s.categories)
  const addCategory = useCategoryStore((s) => s.addCategory)
  const renameCategory = useCategoryStore((s) => s.renameCategory)
  const removeCategory = useCategoryStore((s) => s.removeCategory)

  // [{ id: "1", ... }, { id: "2", ... }] 
  // todosByDate[selectedDate]이므로 해당 날짜에 해당하는 Todo[] 배열만 담김. Record<string, Todo[]>의 사전이 아닌 순수 Todo[] 배열임.
  const todos = todosByDate[selectedDate] ?? []

  // "전체"면 모든 카테고리, 아니면 선택한 카테고리 하나만
  const visibleCategories =
    selectedCategoryId === ALL_CATEGORIES
      ? categories
      : categories.filter((c) => c.id === selectedCategoryId)

  const pendingCategory = categories.find((c) => c.id === pendingDeleteId)

  // 카테고리 삭제 마무리: 카테고리 제거 + 선택 상태 정리 + 대화상자 닫기
  const finishDelete = (id: string) => {
    removeCategory(id)
    if (selectedCategoryId === id) setSelectedCategoryId(ALL_CATEGORIES)
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
              <span className="todo-drawer__category-name">{category.name}</span>
              <TodoList
                todos={todos
                  .filter((t) => t.categoryId === category.id && !t.done)
                  // 중요 일정을 카테고리 최상단으로 (안정 정렬이라 그룹 내 기존 순서 유지)
                  // 스토어(addTodo)는 최초 생성 시 초기 위치만 잡아주고, .sort는 별표 토글로 중요도가 바뀌거나 필터링될 때 최상단 유지를 보장하는 안전장치
                  // a와 b를 비교하여 정렬함. 리턴값이 음수면 ab 순서고, 양수면 ba순서, 0이면 순서 변경 없음.
                  // a = { id: "1", text: "청소하기", important: false } 이런식으로 들어가는데, todos.filter한 것들의 결과 전체 아이템을 2개씩 비교작업을 반복하여 모두 비교함. 
                  .sort((a, b) =>
                      Number(!!b.important) - Number(!!a.important), // !!a: a를 불리언 타입으로 강제 변환. a가 undefined, null, false이면 false로.
                  )}
                onToggle={(id) => toggleTodo(selectedDate, id)}
                onToggleImportant={(id) => toggleImportant(selectedDate, id)}
                onEdit={(id, text) => editTodo(selectedDate, id, text)}
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
            onToggleImportant={(id) => toggleImportant(selectedDate, id)}
            onEdit={(id, text) => editTodo(selectedDate, id, text)}
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