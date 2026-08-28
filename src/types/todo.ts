export interface Todo {
    id: string;
    text: string;
    done: boolean;
}

// key: "YYYY-MM-DD"
export type TodosByDate = Record<string, Todo[]>;