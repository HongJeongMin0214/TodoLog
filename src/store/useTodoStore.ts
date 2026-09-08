import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Todo, TodosByDate } from '../types/todo'

// 날짜별 할 일 목록과 그 CRUD.
// TodoDrawer, 메인 패널의 캘린더 화면(날짜별 개수/완료율), 미니 캘린더가
// 모두 읽으므로 컴포넌트 밖 store에 둔다. (서버 붙기 전까지는 여기서 보관)
interface TodoState {
  todosByDate: TodosByDate // key: "YYYY-MM-DD"
  addTodo: (dateKey: string, categoryId: string, text: string) => void
  toggleTodo: (dateKey: string, id: string) => void
  removeTodo: (dateKey: string, id: string) => void
  // 아래 3개는 카테고리 삭제 시 사용. 투두가 여러 날짜에 흩어져 있으므로 전 날짜 버킷을 순회한다.
  countTodosByCategory: (categoryId: string) => number
  deleteTodosByCategory: (categoryId: string) => void
  reassignTodosByCategory: (fromId: string, toId: string) => void
}

// persist: todosByDate 값을 localStorage("todolog-todos")에 저장·복원한다.
// 함수(액션)는 직렬화되지 않아 자동 제외되고 상태 값만 저장된다.
// (4단계에서 서버 연결 시 이 persist 래퍼를 걷어내고 React Query로 대체)
const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todosByDate: {},

      addTodo: (dateKey, categoryId, text) => {
        const trimmed = text.trim()
        if (!trimmed) return // 공백만 있는 경우 무시
        const todo: Todo = {
          id: crypto.randomUUID(),
          text: trimmed,
          done: false,
          categoryId,
        }
        set((state) => ({
          todosByDate: {
            ...state.todosByDate, // 다른 날짜 목록은 그대로 두고
            [dateKey]: [...(state.todosByDate[dateKey] ?? []), todo], // 해당 날짜 배열 끝에 추가
          },
        }))
      },

      toggleTodo: (dateKey, id) => {
        set((state) => ({
          todosByDate: {
            ...state.todosByDate,
            [dateKey]: (state.todosByDate[dateKey] ?? []).map((t) =>
              t.id === id ? { ...t, done: !t.done } : t,
            ),
          },
        }))
      },

      removeTodo: (dateKey, id) => {
        set((state) => ({
          todosByDate: {
            ...state.todosByDate,
            [dateKey]: (state.todosByDate[dateKey] ?? []).filter(
              (t) => t.id !== id,
            ),
          },
        }))
      },

      countTodosByCategory: (categoryId) =>
        Object.values(get().todosByDate).reduce(
          (sum, list) =>
            sum + list.filter((t) => t.categoryId === categoryId).length,
          0,
        ),

      deleteTodosByCategory: (categoryId) => {
        set((state) => ({
          todosByDate: Object.fromEntries(
            Object.entries(state.todosByDate).map(([date, list]) => [
              date,
              list.filter((t) => t.categoryId !== categoryId),
            ]),
          ),
        }))
      },

      reassignTodosByCategory: (fromId, toId) => {
        set((state) => ({
          todosByDate: Object.fromEntries(
            Object.entries(state.todosByDate).map(([date, list]) => [
              date,
              list.map((t) =>
                t.categoryId === fromId ? { ...t, categoryId: toId } : t,
              ),
            ]),
          ),
        }))
      },
    }),
    { name: 'todolog-todos' },
  ),
)

export default useTodoStore
