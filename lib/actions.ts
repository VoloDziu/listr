import { eq, inArray, isNull } from "drizzle-orm";
import { listsTable, todosTable } from "../db/schema";
import { db } from "./db";

export async function getList(id: number) {
  return await db.query.listsTable.findFirst({
    where: eq(listsTable.id, id),
    with: {
      todos: true,
    },
  });
}

export async function getNonArchivedLists() {
  return await db.query.listsTable.findMany({
    where: isNull(listsTable.parentListId),
    with: {
      todos: true,
    },
  });
}

export async function getArchivedLists(parentListId: number) {
  return await db.query.listsTable.findMany({
    where: eq(listsTable.parentListId, parentListId),
    with: {
      todos: true,
    },
  });
}

export async function createTodo(name: string, listId: number) {
  await db.insert(todosTable).values({
    name: name.trim(),
    listId: listId,
    completed: false,
  });
}

export async function deleteTodo(todoId: number) {
  await db.delete(todosTable).where(eq(todosTable.id, todoId));
}

export async function toggleTodo(todoId: number, completed: boolean) {
  await db
    .update(todosTable)
    .set({ completed: !completed })
    .where(eq(todosTable.id, todoId));
}

export async function archiveCompletedTodos(
  list: typeof listsTable.$inferSelect & {
    todos: (typeof todosTable.$inferSelect)[];
  },
) {
  // Create archive list
  const [archivedList] = await db
    .insert(listsTable)
    .values({
      name: `${list.name} (${new Date().toLocaleDateString()})`,
      parentListId: list.id,
      archivedAt: new Date(),
    })
    .returning();

  // Move completed todos to archive list
  const completedTodos = list.todos.filter((todo) => todo.completed);
  if (completedTodos.length > 0) {
    await db
      .update(todosTable)
      .set({ listId: archivedList.id })
      .where(
        inArray(
          todosTable.id,
          completedTodos.map((todo) => todo.id),
        ),
      );
  }
}
