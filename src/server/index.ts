import { z } from "zod";
import { procedure, router } from "./trpc";

let todo = [
  {
    id: 1701672401212,
    todo: "cooking",
    createdAt: "2023-12-04T06:47:11.280Z",
    status: false,
  },
];
export const appRouter = router({
  getTodos: procedure.query(async () => {
    return todo.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }),
  addTodo: procedure.input(z.object({ todo: z.string() })).mutation((opts) => {
    const date = new Date();
    todo.push({
      todo: opts.input.todo,
      id: date.getTime(),
      status: false,
      createdAt: date.toISOString(),
    });

    return { status: "created" };
  }),
  setDone: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async (opts) => {
      const id = opts.input.id;
      const getIndex = todo.findIndex((i) => i.id === id);
      todo[getIndex].status = true;

      return { status: "updated" };
    }),
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
