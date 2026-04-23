export type PromptStatus = 'pending' | 'approved' | 'rejected';

export interface Prompt {
  id?: string;
  title: string;
  description: string;
  promptText: string;
  mediaUrl?: string;
  category: string;
  tags: string[];
  status: PromptStatus;
  isFeatured: boolean;
  isTrending: boolean;
  viewCount: number;
  copyCount: number;
  createdAt: number;
  updatedAt: number;
}
