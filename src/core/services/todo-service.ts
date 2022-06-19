import { BlogApi } from '@/io/external-api/blog-api';
import { Repository } from 'typeorm';
import { NewTodo, Todo } from '../domains';
import { createTodo } from '../domains/todo';

export class TodoService {
  constructor(
    private todoRepository: Repository<Todo>,
    private blogApi: BlogApi,
  ) {}

  async getTodos(): Promise<Todo[]> {
    return await this.todoRepository.findBy({});
  }

  async addTodo(newToto: NewTodo): Promise<Todo> {
    const todo = await this.todoRepository.save(createTodo(newToto));
    return todo;
  }

  async publishTodo(todoId: number) {
    const todo = await this.todoRepository.findOneOrFail({
      where: { id: todoId },
    });
    const obfuscatdTodo = createTodo({
      ...todo,
      content: todo.content.replace('sensitive-information', '***'),
    });
    await this.blogApi.publish(obfuscatdTodo);
  }
}
