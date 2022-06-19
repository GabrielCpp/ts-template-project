import { config } from 'dotenv';
import fastify from 'fastify';
import { Container } from 'inversify';
import { noop } from 'lodash';
import { DataSource } from 'typeorm';
import { TodoController } from './app/controllers/todo-controller';
import { buildContainer } from './app/modules';

interface HttpError extends Error {
  statusCode: number
}

export async function build(override: (c: Container) => void=noop,opts={logger: true}) {
  config()
  const container = await buildContainer(override)
  const server = fastify(opts);
  server.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    try {
      var json = JSON.parse(body as string)
      done(null, json)
    } catch (err) {
      const error = err as HttpError
      error.statusCode = 400
      done(error, undefined)
    }
  })

  server.decorate('container', container)
  server.register(TodoController, {
    prefix: '/api'
  })

  server.addHook("onClose", async (server, done) => {
    const connection = container.get(DataSource)
    if (connection.isInitialized) {
      await connection.destroy();
    }
    done();
  });

  return server
}

export const start = async () => {
  const server = await build()

  try {
    await server.listen({ port: 3000 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

export type FastifyCustomInstance = Awaited<ReturnType<typeof build>>