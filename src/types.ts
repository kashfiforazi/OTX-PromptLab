export type PromptStatus = 'pending' | 'approved' | 'rejected';

export interface PromptItem {
  promptText: string;
  mediaUrl?: string;
}

export interface Prompt {
  id?: string;
  title: string;
  description: string;
  promptText: string;
  mediaUrl?: string;
  items?: PromptItem[];
  category: string;
  tags: string[];
  status: PromptStatus;
  isFeatured: boolean;
  isTrending: boolean;
  slug: string;
  viewCount: number;
  copyCount: number;
  createdAt: number;
  updatedAt: number;
  authorId?: string;
  authorName?: string;
}
