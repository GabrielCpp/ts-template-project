import { build, FastifyCustomInstance } from "@/server";

describe('todo controller', () =>{
  let app: FastifyCustomInstance;

  beforeAll(async () => {
    app = await build()
    await app.ready();
  });

  afterAll(async () => {
    await app.close()
  })

  test('get all todos', async () => {
    const res = await app.inject({ url: "/api/todos" });
    expect(res.statusCode).toBe(200)

    const body = await res.json()
    expect(body).toEqual([])
  })
})