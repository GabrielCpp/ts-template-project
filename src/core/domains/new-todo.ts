import { NewTodoSchema } from "@/app/schemas";
import { Static } from "@sinclair/typebox";

export type NewTodo = Static<typeof NewTodoSchema>

export function createNewTodo({ content = '', summary = '' }: Partial<NewTodo>) {
  return {
    content,
    summary
  }
}