import { inject, injectable, METADATA_KEY } from 'inversify';

export function bindInjectable(Class: any, parameters: any[]) {
  if (Reflect.hasOwnMetadata(METADATA_KEY.PARAM_TYPES, Class)) {
    return Class;
  }

  const x = injectable()(Class);
  parameters.forEach((p, i) => inject(p)(Class, undefined as any, i));
  return x;
}
