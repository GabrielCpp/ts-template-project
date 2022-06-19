
import { NewTodoSchema } from '@/app/schemas'
import { NewTodo } from '@/core/domains'
import { TodoService } from '@/core/services/todo-service'
import { FastifyInstance } from 'fastify'


export function todoController(api: FastifyInstance, opts:  Record<never, never>, done: (err?: Error) => void) {
  api.get('/todos', async (request, reply) => {
    const todoService = api.container.get(TodoService)
    return todoService.getTodos()
  })

  api.post('/todos',{schema: { body: NewTodoSchema }}, async (request, reply) => {
    const todoService = api.container.get(TodoService)
    return todoService.addTodo(request.body as NewTodo)
  })

  done()
}