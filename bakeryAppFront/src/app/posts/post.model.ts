export interface Post {
    _id: string;
    title: string;
    subtitle?: string;
    description?: string;
    content: string;
    items?: string[];
    steps?: string[];
    tags?: string[];
    url?: string;
    imgUrl?: File | string;
    attachedFile?: string;
    category?: string;
    date?: string;
    price?: number;
    status?: 'draft' | 'published' | 'archived';
    views?: number;
    likes?: number;
    comments?: string[]; // assuming 'Comment' is another Schema and its _id is of type string
    author?: string; // assuming 'Author' is another Schema and its _id is of type string
}


