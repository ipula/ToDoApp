import { beforeEach, describe, expect, it } from "vitest";
import { CreateTodo } from "../../../../src/application/todo/use-cases/CreateTodo.ts";
import { DeleteTodo } from "../../../../src/application/todo/use-cases/DeleteTodo.ts";
import { GetTodo } from "../../../../src/application/todo/use-cases/GetTodo.ts";
import { ListTodos } from "../../../../src/application/todo/use-cases/ListTodos.ts";
import { ToggleTodo } from "../../../../src/application/todo/use-cases/ToggleTodo.ts";
import { UpdateTodo } from "../../../../src/application/todo/use-cases/UpdateTodo.ts";
import { ValidationError } from "../../../../src/domain/shared/ValidationError.ts";
import { TodoNotFoundError } from "../../../../src/domain/todo/errors.ts";
import { InMemoryTodoRepository } from "../../../fakes/InMemoryTodoRepository.ts";

/** Well-formed UUID that is never stored. */
const UNKNOWN_ID = "00000000-0000-4000-8000-000000000000";

describe("todo use cases", () => {
  let repo: InMemoryTodoRepository;

  beforeEach(() => {
    repo = new InMemoryTodoRepository();
  });

  it("creates a todo and returns it in the API shape", async () => {
    const dto = await new CreateTodo(repo).execute({ title: "Write tests" });

    expect(dto).toMatchObject({ title: "Write tests", done: false });
    expect(dto._id).toBeTypeOf("string");
    expect(dto).not.toHaveProperty("description");
  });

  it("lists todos newest first", async () => {
    const create = new CreateTodo(repo);
    await create.execute({ title: "First" });
    await new Promise((resolve) => setTimeout(resolve, 5));
    await create.execute({ title: "Second" });

    const list = await new ListTodos(repo).execute();

    expect(list.map((t) => t.title)).toEqual(["Second", "First"]);
  });

  it("gets a single todo by id", async () => {
    const created = await new CreateTodo(repo).execute({ title: "Find me" });

    const found = await new GetTodo(repo).execute(created._id);

    expect(found).toEqual(created);
  });

  it("updates title and description and persists the change", async () => {
    const created = await new CreateTodo(repo).execute({ title: "Draft" });

    await new UpdateTodo(repo).execute(created._id, {
      title: "Final",
      description: "Done properly",
    });
    const stored = await new GetTodo(repo).execute(created._id);

    expect(stored.title).toBe("Final");
    expect(stored.description).toBe("Done properly");
  });

  it("toggles done and persists the change", async () => {
    const created = await new CreateTodo(repo).execute({ title: "Toggle me" });

    const toggled = await new ToggleTodo(repo).execute(created._id);
    const stored = await new GetTodo(repo).execute(created._id);

    expect(toggled.done).toBe(true);
    expect(stored.done).toBe(true);
  });

  it("deletes a todo", async () => {
    const created = await new CreateTodo(repo).execute({ title: "Delete me" });

    await new DeleteTodo(repo).execute(created._id);

    expect(await new ListTodos(repo).execute()).toEqual([]);
  });

  it("throws TodoNotFoundError for an unknown id", async () => {
    await expect(new GetTodo(repo).execute(UNKNOWN_ID)).rejects.toThrow(TodoNotFoundError);
    await expect(new ToggleTodo(repo).execute(UNKNOWN_ID)).rejects.toThrow(TodoNotFoundError);
    await expect(new DeleteTodo(repo).execute(UNKNOWN_ID)).rejects.toThrow(TodoNotFoundError);
  });

  it("throws ValidationError for a malformed id", async () => {
    await expect(new GetTodo(repo).execute("not-a-uuid")).rejects.toThrow(ValidationError);
  });
});
