export interface Task {
    id: number;
    title: string;
    completed: number;
    category: string;
    date: string;
    images: string;
}

export interface Category {
    id: number;
    label: string;
    value: string;
    color: string;
}