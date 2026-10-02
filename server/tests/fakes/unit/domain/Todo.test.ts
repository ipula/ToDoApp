import { describe, expect, it } from "vitest";
import { Todo } from "../../../../src/domain/todo/Todo.ts";
import { ValidationError } from "../../../../src/domain/shared/ValidationError.ts";

const createdAt = new Date("2026-01-01T10:00:00Z");
const later = new Date("2026-01-02T10:00:00Z");

describe("Todo", () => {
  describe("create", () => {
    it("trims the title and starts as not done", () => {
      const todo = Todo.create({ title: "  Buy milk  " }, createdAt);
      const snapshot = todo.toSnapshot();

      expect(snapshot.title).toBe("Buy milk");
      expect(snapshot.description).toBe("");
      expect(snapshot.done).toBe(false);
      expect(snapshot.createdAt).toEqual(createdAt);
      expect(snapshot.updatedAt).toEqual(createdAt);
    });

    it("rejects an empty or whitespace-only title", () => {
      expect(() => Todo.create({ title: "   " })).toThrow(ValidationError);
    });

    it("rejects a title over 100 characters", () => {
      expect(() => Todo.create({ title: "a".repeat(101) })).toThrow(/at most 100/);
    });

    it("rejects a description over 500 characters", () => {
      expect(() => Todo.create({ title: "Valid", description: "a".repeat(501) })).toThrow(
        ValidationError,
      );
    });
  });

  describe("edit", () => {
    it("updates only the provided fields and bumps updatedAt", () => {
      const todo = Todo.create({ title: "Old", description: "Keep me" }, createdAt);

      todo.edit({ title: "New" }, later);
      const snapshot = todo.toSnapshot();

      expect(snapshot.title).toBe("New");
      expect(snapshot.description).toBe("Keep me");
      expect(snapshot.updatedAt).toEqual(later);
    });

    it("applies nothing if any field is invalid", () => {
      const todo = Todo.create({ title: "Original" }, createdAt);

      expect(() => {
        todo.edit({ title: "Changed", description: "a".repeat(501) }, later);
      }).toThrow(ValidationError);
      expect(todo.toSnapshot().title).toBe("Original");
      expect(todo.toSnapshot().updatedAt).toEqual(createdAt);
    });
  });

  describe("toggleDone", () => {
    it("flips done back and forth", () => {
      const todo = Todo.create({ title: "Task" });

      todo.toggleDone();
      expect(todo.toSnapshot().done).toBe(true);

      todo.toggleDone();
      expect(todo.toSnapshot().done).toBe(false);
    });
  });
});
