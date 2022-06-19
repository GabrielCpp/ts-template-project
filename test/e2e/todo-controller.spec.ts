import { SETTINGS } from '@/app/modules/settings';
import { createNewTodo, NewTodo, Todo } from '@/core/domains';
import { build, FastifyCustomInstance } from '@/server';
import { Settings } from '@/settings';
import { getLocal } from 'mockttp';
import { DataSource } from 'typeorm';

describe('todo controller', () => {
  const mockServer = getLocal();
  let app: FastifyCustomInstance;
  let connections;

  beforeEach(async () => {
    await mockServer.start();

    app = await build(async (c) => {
      const settings = c.get<Settings>(SETTINGS);
      c.rebind(SETTINGS).toConstantValue({
        ...settings,
        blogBaseUrl: mockServer.urlFor(''),
      });
    });

    const db = app.container.get(DataSource);
    for (const entity of db.entityMetadatas) {
      const repository = db.getRepository(entity.name);
      await repository.clear();
    }

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
    await mockServer.stop();
  });

  it('get all todos', async () => {
    const res = await app.inject({ url: '/api/todos' });
    expect(res.statusCode).toBe(200);

    const body = await res.json();
    expect(body).toEqual([]);
  });

  it('publish a created todo', async () => {
    const newTodo: NewTodo = createNewTodo({ content: 'a' });

    let res = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: newTodo,
    });
    expect(res.statusCode).toEqual(200);

    const todo: Todo = JSON.parse(res.body);
    await mockServer
      .forPost('/publish/todo')
      .withBody(res.body)
      .thenReply(200, 'A mocked response');
    res = await app.inject({
      method: 'POST',
      url: `/api/todos/${todo.id}/publish`,
    });
    expect(res.statusCode).toEqual(200);
  });
});
