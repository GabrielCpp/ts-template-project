import { Settings } from "@/settings";
import { ContainerModule, interfaces } from "inversify";

export const SETTINGS = Symbol.for('settings')

export const settingsModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<Settings>(SETTINGS).toConstantValue({
    blogBaseUrl: process.env['BLOG_BASE_URL'] as string
  })

});