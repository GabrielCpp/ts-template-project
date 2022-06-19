import { Todo } from '@/core/domains';
import { AsyncContainerModule, interfaces } from 'inversify';
import { DataSource, Repository } from 'typeorm';

export const TODO_REPOSITORY = Symbol.for('TODO_REPOSITORY');

export const databaseModule = new AsyncContainerModule(
  async (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    const AppDataSource = new DataSource({
      type: 'postgres',
      host: process.env['DB_HOST'],
      port: 5432,
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_NAME'],
      synchronize: false,
      logging: false,
      entities: [Todo],
      subscribers: [],
      migrations: [],
    });

    bind(DataSource).toConstantValue(AppDataSource);
    bind<Repository<Todo>>(TODO_REPOSITORY).toDynamicValue((c) =>
      c.container.get(DataSource).getRepository(Todo),
    );

    await AppDataSource.initialize();
  },
);
