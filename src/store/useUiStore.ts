import { create } from 'zustand'

export type MainView = 'calendar' | 'memo'

// 화면 레이아웃 상태.
// 카테고리 바 위치(화면 최상단 / 드로어 상단 / 캘린더 상단)와
// 캘린더 화면의 날짜 클릭 동작(드로어 열림이면 드로어로, 닫힘이면 팝오버)이
// 이 두 값의 조합에 따라 달라지므로, 서로 다른 트리에서 함께 읽도록 store에 둔다.
interface UiState {
  isTodoDrawerOpen: boolean
  mainView: MainView
  toggleTodoDrawer: () => void
  setTodoDrawerOpen: (open: boolean) => void
  setMainView: (view: MainView) => void
}

const useUiStore = create<UiState>((set) => ({
  isTodoDrawerOpen: true,
  mainView: 'calendar',
  toggleTodoDrawer: () =>
    set((state) => ({ isTodoDrawerOpen: !state.isTodoDrawerOpen })),
  setTodoDrawerOpen: (open) => set({ isTodoDrawerOpen: open }),
  setMainView: (view) => set({ mainView: view }),
}))

export default useUiStore
