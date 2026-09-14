import { useCallback, useRef } from 'react'

// <textarea>가 내용 길이에 맞춰 세로로 늘어나도록 하는 유틸.
// height를 auto로 리셋한 뒤 scrollHeight로 지정한다.
// 사용법: ref를 <textarea>에 연결하고, onChange마다 · 값이 외부에서 바뀌는 시점에 resize() 호출.
function useAutoGrowTextarea() {
  const ref = useRef<HTMLTextAreaElement>(null)

  const resize = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto' // 줄어들 때도 반영되도록 먼저 초기화
    el.style.height = `${el.scrollHeight}px`
  }, [])

  return { ref, resize }
}

export default useAutoGrowTextarea
