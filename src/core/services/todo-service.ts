import { BlogApi } from "@/io/external-api/blog-api";
import { DataSource } from "typeorm";
import { NewTodo, Todo } from "../domains";
import { createTodo } from "../domains/todo";

export class TodoService {
  constructor(private db: DataSource, private blogApi: BlogApi) {}

  async getTodos(): Promise<Todo[]> {
    const todoRepository = this.db.getRepository(Todo)
    return await todoRepository.findBy({})
  }

  async addTodo(newToto: NewTodo): Promise<Todo> {
    const todoRepository = this.db.getRepository(Todo)
    const todo = await todoRepository.save(createTodo(newToto))
    return todo
  }

  async publishTodo(todo: Todo) {
    const obfuscatdTodo = createTodo({...todo, content: todo.content.replace('sensitive-information', '***')})
    await this.blogApi.publish(obfuscatdTodo)
  }
}