import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { config } from 'dotenv';
import fastify from 'fastify';
import { DataSource } from 'typeorm';
import { todoController } from './app/controllers/todo-controller';
import { buildContainer } from './app/modules';

const ajv = addFormats(new Ajv({}), [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex',
])
  .addKeyword('kind')
  .addKeyword('modifier');
  
interface HttpError extends Error {
  statusCode: number
}

export async function build(opts={logger: true}) {
  config()
  const container = await buildContainer()
  const server = fastify(opts).withTypeProvider<TypeBoxTypeProvider>();
  server.setValidatorCompiler(({ schema, method, url, httpPart }) => {
    return ajv.compile(schema);
  });
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
  server.register(todoController,{
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