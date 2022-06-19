import { Todo } from '@/core/domains';
import { Settings } from '@/settings';
import axios from 'axios';

export class BlogApi {
  private baseUrl: string;

  constructor(settings: Settings) {
    this.baseUrl = settings.blogBaseUrl;
  }

  async publish(todo: Todo) {
    await axios.post(`${this.baseUrl}/publish/todo`, todo, {
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
