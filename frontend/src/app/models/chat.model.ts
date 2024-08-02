
export interface IGetChat {
    sessionId: string;
    answer: string;
}
export interface IQuestionAndAnswer {
    sessionId?: string;
    text: string;
    from: 'user' | 'system';
    loading?: boolean;
    pageNumber?: number;
    source?: any;
}

export interface IGetSuggestions {
    questions: string[];
}