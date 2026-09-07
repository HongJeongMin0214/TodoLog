import { create } from 'zustand'
import { todayKey } from '../lib/date'

// 카테고리 "전체" 탭 id (특정 카테고리가 아니라 모두 보기)
export const ALL_CATEGORIES = 'all'

// 드로어 ↔ 캘린더가 함께 쓰는 "선택 상태".
// 서버로 저장되는 데이터가 아니라 순수 UI 선택값이므로 store에 둔다.
interface SelectionState {
  selectedDate: string // "YYYY-MM-DD"
  selectedCategoryId: string // 특정 카테고리 id 또는 ALL_CATEGORIES
  setSelectedDate: (dateKey: string) => void
  setSelectedCategoryId: (id: string) => void
}

const useSelectionStore = create<SelectionState>((set) => ({
  selectedDate: todayKey(),
  selectedCategoryId: ALL_CATEGORIES,
  setSelectedDate: (dateKey) => set({ selectedDate: dateKey }),
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
}))

export default useSelectionStore
