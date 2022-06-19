import { Todo } from "@/core/domains";
import { createTodo } from "@/core/domains/todo";
import { TodoService } from "@/core/services/todo-service";
import { BlogApi } from "@/io/external-api";
import { isEqual } from "lodash";
import { It, Mock, Times } from "moq.ts";
import { Repository } from "typeorm";

function equal<T>(expected: T) {
  return It.Is<T>((e) => isEqual(e, expected))
}

describe('todo service', () =>{
  let todoServcie: TodoService;
  let todoRepository: Mock<Repository<Todo>>
  let blogApi: Mock<BlogApi>

  beforeEach(() => {
    todoRepository = new Mock<Repository<Todo>>()
    blogApi = new Mock<BlogApi>()
    todoServcie = new TodoService(todoRepository.object(), blogApi.object())
  });

  it('get all todos', async () => {
    const expectedTodo = createTodo({
      content: 'a',
      summary: 'b',
      id: 1
    })

    todoRepository
      .setup(i => i.findOneOrFail(equal({ where: { id: 1 }})))
      .returnsAsync(expectedTodo)

    blogApi.setup(i => i.publish(equal(expectedTodo))).returnsAsync()
      
    await todoServcie.publishTodo(1)

    blogApi.verify(i => i.publish(equal(expectedTodo)), Times.Once());
  })
})