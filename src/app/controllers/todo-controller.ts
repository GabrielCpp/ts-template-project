import {
  NewTodoSchema,
  PublishTodoParam,
  PublishTodoParamSchema,
} from '@/app/schemas';
import { NewTodo } from '@/core/domains';
import { TodoService } from '@/core/services/todo-service';
import { FastifyInstance, FastifyRequest } from 'fastify';

export const TodoController = async (
  api: FastifyInstance,
  opts: Record<never, never>,
) => {
  const todoService = api.container.get(TodoService);

  api.get('/todos', async (request, reply) => {
    return todoService.getTodos();
  });

  api.post(
    '/todos',
    { schema: { body: NewTodoSchema } },
    async (request: FastifyRequest<{ Body: NewTodo }>, reply) => {
      return todoService.addTodo(request.body);
    },
  );

  api.post(
    '/todos/:id/publish',
    { schema: { params: PublishTodoParamSchema } },
    async (request: FastifyRequest<{ Params: PublishTodoParam }>, reply) => {
      await todoService.publishTodo(request.params.id);
      reply.send();
    },
  );
};
