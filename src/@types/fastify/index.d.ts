import 'fastify';
import { FastifyLoggerInstance, FastifyTypeProvider, FastifyTypeProviderDefault, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerBase, RawServerDefault } from 'fastify';
import { Container } from 'inversify';

declare module 'fastify' {
  export interface FastifyInstance<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  Logger extends FastifyLoggerInstance = FastifyLoggerInstance,
  TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
> {
    container: Container;
  }
}