import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category } from '../types/todo'

// 항상 존재하는 기본 카테고리. 삭제 불가, 이름 변경은 허용
export const DEFAULT_CATEGORY_ID = 'default'

// 카테고리 색상 프리셋 (ColorPalette가 이 목록을 스와치로 보여줌). 마지막(회색)을 기본색으로 사용
export const CATEGORY_COLORS = [
  { name: '연블루', value: '#7986CC' },
  { name: '빨강', value: '#D44245' },
  { name: '핑크', value: '#F17298' },
  { name: '주황', value: '#EA9E5A' },
  { name: '노랑', value: '#fccb06ff' },
  { name: '청록', value: '#5FC59D' },
  { name: '초록', value: '#69B054' },
  { name: '민트', value: '#60D2D2' },
  { name: '하늘', value: '#81AAE8' },
  { name: '파랑', value: '#3182F6' },
  { name: '연보라', value: '#B192E7' },
  { name: '회색', value: '#A9A9A9' },
] as const
export const DEFAULT_CATEGORY_COLOR: string =
  CATEGORY_COLORS[CATEGORY_COLORS.length - 1].value

// 카테고리 목록과 그 CRUD.
// TodoDrawer뿐 아니라 메인 패널의 캘린더 화면·페이지 상단 카테고리 바에서도
// 함께 읽으므로 컴포넌트 밖 store에 둔다. (서버 붙기 전까지는 여기서 보관)
interface CategoryState {
  categories: Category[]
  addCategory: (name: string, color?: string) => Category | null // 이름이 빈 값이면 null 반환
  renameCategory: (id: string, name: string) => void
  setCategoryColor: (id: string, color: string) => void
  removeCategory: (id: string) => void
}
// set((state) => ({ ... }))로 상태를 갱신. 
// state는 현재 상태: {  categories: [{ id: 'default', name: '할 일' }], addCategory: [Function: addCategory]})
// set({ ... })로 상태를 갱신하면 이전 상태를 무시하고 새 상태로 덮어씀
// persist: categories 값을 localStorage("todolog-categories")에 저장·복원한다.
// 함수(액션)는 직렬화되지 않으므로 자동으로 제외되고 상태 값만 저장된다.
// (4단계에서 서버 연결 시 이 persist 래퍼를 걷어내고 React Query로 대체)
const useCategoryStore = create<CategoryState>()(
  persist( // persist: Zustand 상태 관리 라이브러리에서 상태를 브라워저, 로컬 스토리지, 세션 스토리지 등에 영구적으로 저장하고 관리할 수 있게 해주는 미들웨어
    (set) => ({
      categories: [
        { id: DEFAULT_CATEGORY_ID, name: '할 일', color: DEFAULT_CATEGORY_COLOR },
      ],

      addCategory: (name, color) => {
        const trimmed = name.trim()
        if (!trimmed) return null
        const category: Category = {
          id: crypto.randomUUID(),
          name: trimmed,
          color: color ?? DEFAULT_CATEGORY_COLOR, // 색을 안 정했으면 기본색
        }
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

      setCategoryColor: (id, color) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, color } : c,
          ),
        }))
      },

      removeCategory: (id) => {
        if (id === DEFAULT_CATEGORY_ID) return // 기본 카테고리는 삭제 불가
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
      },
    }),
    { name: 'todolog-categories' },
  ),
)

export default useCategoryStore