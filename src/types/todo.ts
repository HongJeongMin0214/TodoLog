export interface Category {
    id: string;
    name: string;
    color?: string; // 카테고리 색상 (hex). 이전에 저장된 카테고리엔 없을 수 있어 옵셔널 → 읽는 쪽에서 기본색으로 방어
}

export interface Todo {
    id: string;
    text: string;
    done: boolean;
    categoryId: string;
    important?: boolean; // 중요 일정: 카테고리 목록 최상단에 고정 (미설정 = false)
}

// key: "YYYY-MM-DD"
export type TodosByDate = Record<string, Todo[]>;
