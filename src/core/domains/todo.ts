import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  summary: string;

  @Column()
  content: string;
}

export function createTodo(todo: Partial<Todo>): Todo {
  const result = new Todo();
  if (todo.id) {
    result.id = todo.id;
  }

  result.summary = todo.summary || '';
  result.content = todo.content || '';
  return result;
}
