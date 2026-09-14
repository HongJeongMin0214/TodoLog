import { create } from 'zustand'
import { todayKey } from '../lib/date'

// 카테고리 "전체" 탭 id (특정 카테고리가 아니라 모두 보기)
export const ALL_CATEGORIES = 'all'

// TodoDrawer와 "메인 패널의 캘린더 화면"(src/components/MainContent/calendar/)이
// 함께 쓰는 선택 상태. 두 컴포넌트는 서로 다른 트리에 있어 props로 공유하기 어렵고,
// 서버로 저장되는 데이터가 아니라 순수 UI 선택값이므로 store에 둔다.
// (드로어 안의 MiniCalendar는 TodoDrawer의 자식이라 props로 전달받음 — store를 직접 쓰지 않음)
interface SelectionState {
  selectedDate: string // "YYYY-MM-DD". 캘린더 화면에서 날짜 셀을 클릭하면 이 값이 바뀌고 드로어가 따라감
  selectedCategoryId: string // 특정 카테고리 id 또는 ALL_CATEGORIES. 현재는 드로어에서만 사용
  // "지금 보고 있는 달": 캘린더 화면과 미니 캘린더가 같은 값을 공유해서, 한쪽에서 달을 넘기면 다른 쪽도 같이 움직임
  viewedYear: number
  viewedMonth: number // 0-based
  setSelectedDate: (dateKey: string) => void
  setSelectedCategoryId: (id: string) => void
  setViewedMonth: (year: number, month: number) => void
  goToPrevMonth: () => void
  goToNextMonth: () => void
  goToToday: () => void // 선택 날짜 + 보는 달을 한 번에 오늘로 이동
}

const now = new Date()

const useSelectionStore = create<SelectionState>((set) => ({
  selectedDate: todayKey(),
  selectedCategoryId: ALL_CATEGORIES,
  viewedYear: now.getFullYear(),
  viewedMonth: now.getMonth(),

  setSelectedDate: (dateKey) => set({ selectedDate: dateKey }),
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),

  setViewedMonth: (year, month) => set({ viewedYear: year, viewedMonth: month }),

  goToPrevMonth: () =>
    set(({ viewedYear, viewedMonth }) =>
      viewedMonth === 0
        ? { viewedYear: viewedYear - 1, viewedMonth: 11 }
        : { viewedYear, viewedMonth: viewedMonth - 1 },
    ),
  goToNextMonth: () =>
    set(({ viewedYear, viewedMonth }) =>
      viewedMonth === 11
        ? { viewedYear: viewedYear + 1, viewedMonth: 0 }
        : { viewedYear, viewedMonth: viewedMonth + 1 },
    ),

  goToToday: () => {
    const n = new Date()
    set({
      selectedDate: todayKey(),
      viewedYear: n.getFullYear(),
      viewedMonth: n.getMonth(),
    })
  },
}))

export default useSelectionStore
