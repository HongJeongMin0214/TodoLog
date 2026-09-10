export interface Category {
    id: string;
    name: string;
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
