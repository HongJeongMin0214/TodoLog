import { useState } from 'react'
import type { Category } from '../types/todo'

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  const addCategory = (name: string): Category | null => {
    const trimmed = name.trim()
    if (!trimmed) return null
    const category: Category = { id: crypto.randomUUID(), name: trimmed }
    setCategories((prev) => [...prev, category])
    return category
  }

  return { categories, addCategory }
}

export default useCategories
