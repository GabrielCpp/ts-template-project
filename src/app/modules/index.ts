import { Container } from 'inversify';
import { noop } from 'lodash';
import 'reflect-metadata';
import { databaseModule } from './database';
import { externalApiModule } from './external-api';
import { servicesModule } from './services';
import { settingsModule } from './settings';

export async function buildContainer(
  override: (c: Container) => void = noop,
): Promise<Container> {
  const container = new Container();
  await container.loadAsync(databaseModule);
  container.load(settingsModule);
  container.load(servicesModule);
  container.load(externalApiModule);
  override(container);
  return container;
}
