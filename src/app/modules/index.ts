import { Todo } from "@/core/domains";
import { TodoService } from "@/core/services/todo-service";
import { BlogApi } from "@/io/external-api/blog-api";
import { SETTINGS, Settings } from "@/settings";
import { AsyncContainerModule, Container, interfaces } from "inversify";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { bindInjectable } from './inversify-injectable';

const databaseModule = new AsyncContainerModule(async (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  const AppDataSource = new DataSource({
      type: "postgres",
      host: process.env['DB_HOST'],
      port: 5432,
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_NAME'],
      synchronize: true,
      logging: true,
      entities: [Todo],
      subscribers: [],
      migrations: [],
  })
  
  await AppDataSource.initialize()
  bind(DataSource).toConstantValue(AppDataSource)
});

export async function buildContainer(): Promise<Container> {
  const container = new Container();
  await container.loadAsync(databaseModule)

  container.bind<Settings>(SETTINGS).toConstantValue({
    blogBaseUrl: process.env['BLOG_BASE_URL'] as string
  })
  container.bind(BlogApi).to(bindInjectable(BlogApi, [SETTINGS]))
  container.bind(TodoService).to(bindInjectable(TodoService, [DataSource, BlogApi]))
  
  return container
}