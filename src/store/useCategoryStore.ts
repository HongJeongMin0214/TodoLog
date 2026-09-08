import { create } from 'zustand'
import type { Category } from '../types/todo'

// 항상 존재하는 기본 카테고리. 삭제 불가, 이름 변경은 허용
export const DEFAULT_CATEGORY_ID = 'default'

// 카테고리 목록과 그 CRUD.
// TodoDrawer뿐 아니라 메인 패널의 캘린더 화면·페이지 상단 카테고리 바에서도
// 함께 읽으므로 컴포넌트 밖 store에 둔다. (서버 붙기 전까지는 여기서 보관)
interface CategoryState {
  categories: Category[]
  addCategory: (name: string) => Category | null // 이름이 빈 값이면 null 반환
  renameCategory: (id: string, name: string) => void
  removeCategory: (id: string) => void
}
// set((state) => ({ ... }))로 상태를 갱신. 
// state는 현재 상태: {  categories: [{ id: 'default', name: '할 일' }], addCategory: [Function: addCategory]})
// set({ ... })로 상태를 갱신하면 이전 상태를 무시하고 새 상태로 덮어씀
const useCategoryStore = create<CategoryState>((set) => ({
  categories: [{ id: DEFAULT_CATEGORY_ID, name: '할 일' }],

  addCategory: (name) => {
    const trimmed = name.trim()
    if (!trimmed) return null
    const category: Category = { id: crypto.randomUUID(), name: trimmed }
    // 기존 상태(categories 배열)를 복사하고 새 카테고리를 추가한 새 배열로 상태를 갱신
    set((state) => ({ categories: [...state.categories, category] }))
    return category
  },

  renameCategory: (id, name) => {
    const trimmed = name.trim()
    if (!trimmed) return // 빈 값이면 무시 (기본 카테고리 포함 모두 이름 변경 허용)
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, name: trimmed } : c,
      ),
    }))
  },

  removeCategory: (id) => {
    if (id === DEFAULT_CATEGORY_ID) return // 기본 카테고리는 삭제 불가
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }))
  },
}))

export default useCategoryStore