import { TodoService } from "@/core/services/todo-service";
import { BlogApi } from "@/io/external-api";
import { ContainerModule, interfaces } from "inversify";
import { TODO_REPOSITORY } from "./database";
import { bindInjectable } from "./inversify-injectable";


export const servicesModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind(TodoService).to(bindInjectable(TodoService, [TODO_REPOSITORY, BlogApi]))
});