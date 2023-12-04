import { serverClient } from "./_trpc/serverClient";
import TodoList from "./_components/Todos";

export const dynamic = "force-dynamic";

export default async function IndexPage() {
  const todo = await serverClient.getTodos();
  // const hello = trpc.hello.useQuery({ text: "client" });
  return (
    <div>
      <TodoList initialTodos={todo} />
    </div>
  );
}
