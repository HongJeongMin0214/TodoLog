import { useState } from 'react'
import type { Todo, TodosByDate } from '../types/todo'

function useTodos() {
  const [todosByDate, setTodosByDate] = useState<TodosByDate>({})

  const getTodos = (dateKey: string): Todo[] => todosByDate[dateKey] ?? []

  const addTodo = (dateKey: string, categoryId: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return // 공백만 있는 경우 무시
    const todo: Todo = { id: crypto.randomUUID(), text: trimmed, done: false, categoryId } // categoryId는 임시로 'default'로 설정
    setTodosByDate((prev) => ({ // 소괄호 ()로 감싸야 객체를 반환 return
      ...prev, // 다른 날짜의 할 일 목록은 그대로 두고, 
      [dateKey]: [...(prev[dateKey] ?? []), todo], // 해당 날짜의 기존 할 일 배열(['청소하기', '운동하기'])을 ...으로 펼치고 그 맨뒤에 todo를 붙여 완전히 새 배열 만들기.해당 날짜의 할 일 목록만 업데이트
    }))
  }

  const toggleTodo = (dateKey: string, id: string) => {
    setTodosByDate((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] ?? []).map((t) =>
        t.id === id ? { ...t, done: !t.done } : t, // 해당 id의 할 일만 done 상태를 토글. 아니면 그대로
      ),
    }))
  }

  const removeTodo = (dateKey: string, id: string) => {
    setTodosByDate((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] ?? []).filter((t) => t.id !== id), // 검사하여 조건에 만족하는건 새 배열에 차례로 담기(filter)는데, 이 때 id가 일치하는 건 제외 됨
    }))
  }

  return { todosByDate, getTodos, addTodo, toggleTodo, removeTodo }
}

export default useTodos