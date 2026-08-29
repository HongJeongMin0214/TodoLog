// 로컬 시간 기준 "YYYY-MM-DD"
export function toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export const todayKey = (): string => toDateKey(new Date());

/** year, month(0-based)의 달력 그리드용 날짜 42칸(6주 × 7일). 앞뒤 달 일부 포함 */
export function getCalendarDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1) // 요청받은 연도와 월의 1일에 해당하는 날짜 객체를 생성. ex) 2023년 6월 1일이면 new Date(2023, 5, 1) 6월인데 month가 0부터 시작하므로 5를 넣어야 함
  const startDay = first.getDay() // 0(일)~6(토). 1일이 무슨 요일인지 숫자로 가져옴
  const start = new Date(year, month, 1 - startDay) // 달력의 첫 칸(이전 달로 넘어갈 수 있음) 구하기. 1일이 수요일(3)이면 1-3=-2. js의 Date는 음수이면 이전 달 날짜로 계산해 줌.
  return Array.from({ length: 42 }, (_, i) => { // 42칸짜리 배열을 만들고, 각 칸에 해당하는 날짜를 계산하여 Date 객체로 반환. 
  // Array.from(A,B): 특정 길이만큼의 배열을 즉석에서 만들 때. A: 배열 길이, B: 각 칸마다 실행할 함수
    const d = new Date(start) // start를 복사한 Date 객체 생성. start를 직접 수정하면 안 되므로 복사본을 만들어서 수정
    d.setDate(start.getDate() + i) // start의 날짜에 i를 더해서 각 칸에 해당하는 날짜를 계산. 0이면 start 그대로, 1이면 start+1일, 2이면 start+2일, ..., 41이면 start+41일
    return d
  })
}