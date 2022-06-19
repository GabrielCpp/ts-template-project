import { BlogApi } from '@/io/external-api';
import { ContainerModule, interfaces } from 'inversify';
import { bindInjectable } from './inversify-injectable';
import { SETTINGS } from './settings';

export const externalApiModule = new ContainerModule(
  (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind(BlogApi).to(bindInjectable(BlogApi, [SETTINGS]));
  },
);
