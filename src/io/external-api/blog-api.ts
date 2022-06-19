import { Todo } from '@/core/domains';
import { Settings } from '@/settings';
import fetch from 'node-fetch';

export class BlogApi {
  private baseUrl: string;

  constructor(settings: Settings) {
    this.baseUrl = settings.blogBaseUrl;
  }

  async publish(todo: Todo) {
    const response = await fetch(`${this.baseUrl}/publish/todo`, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to publish todo');
    }
  }
}
