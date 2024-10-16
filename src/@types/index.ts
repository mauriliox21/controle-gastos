export type Category = {
    id: string;
    name: string;
}

export type Debt = {
    id: string;
    description: string;
    value: number;
    category?: Category;
    date: Date;
}