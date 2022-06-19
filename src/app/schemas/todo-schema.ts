import { Static, Type } from '@sinclair/typebox';

export const NewTodoSchema = Type.Strict(
  Type.Object({
    summary: Type.String(),
    content: Type.String(),
  }),
);

export const PublishTodoParamSchema = Type.Strict(
  Type.Object({
    id: Type.Integer(),
  }),
);

export type PublishTodoParam = Static<typeof PublishTodoParamSchema>;
