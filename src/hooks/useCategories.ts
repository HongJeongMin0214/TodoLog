import { useState } from 'react'
import type { Category } from '../types/todo'

// 항상 존재하는 기본 카테고리. 삭제 불가, 이름 변경은 허용 예정
export const DEFAULT_CATEGORY_ID = 'default'

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([
    { id: DEFAULT_CATEGORY_ID, name: '할일' },
  ])

  const addCategory = (name: string): Category | null => { // : Category | null는 이 함수가 최종적으로 반환할 타입을 명시. A|B는 A 또는 B라는 의미.
    const trimmed = name.trim()
    if (!trimmed) return null
    const category: Category = { id: crypto.randomUUID(), name: trimmed }
    setCategories((prev) => [...prev, category])
    return category
  }

  return { categories, addCategory }
}

export default useCategories
