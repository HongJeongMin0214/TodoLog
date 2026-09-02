export interface Category {
    id: string;
    name: string;
}

export interface Todo {
    id: string;
    text: string;
    done: boolean;
    categoryId: string;
}

// key: "YYYY-MM-DD"
export type TodosByDate = Record<string, Todo[]>;
