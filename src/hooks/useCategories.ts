import { useState } from 'react'
import type { Category } from '../types/todo'

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])

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
