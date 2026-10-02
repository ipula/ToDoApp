import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import type { Express } from "express";
import { createApp } from "../../src/app.ts";
import { createContainer } from "../../src/container.ts";
import { InMemoryTodoRepository } from "../fakes/InMemoryTodoRepository.ts";

/** Well-formed UUID that is never stored. */
const UNKNOWN_ID = "00000000-0000-4000-8000-000000000000";

/**
 * Exercises the full HTTP stack (routing, validation, controller, use cases,
 * error handling) with an in-memory repository in place of MongoDB.
 */
describe("Todos API", () => {
  let app: Express;

  beforeEach(() => {
    const { todoController } = createContainer(new InMemoryTodoRepository());
    app = createApp({ corsOrigin: "http://localhost:5173", todoController });
  });

  /** Creates a todo through the API and returns its id. */
  async function createTodo(body: object): Promise<string> {
    const res = await request(app).post("/api/todos").send(body).expect(201);
    return (res.body as { _id: string })._id;
  }

  describe("POST /api/todos", () => {
    it("creates a todo and returns 201 with the API shape", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: "  Write tests  ", description: "With supertest" })
        .expect(201);

      expect(res.body).toMatchObject({
        title: "Write tests",
        description: "With supertest",
        done: false,
      });
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("createdAt");
    });

    it("returns 400 with field details for an empty title", async () => {
      const res = await request(app).post("/api/todos").send({ title: "   " }).expect(400);

      expect(res.body).toEqual({
        error: {
          code: "VALIDATION_ERROR",
          message: "Title is required",
          details: [{ field: "title", message: "Title is required" }],
        },
      });
    });

    it("returns 400 when title is missing", async () => {
      const res = await request(app).post("/api/todos").send({}).expect(400);

      expect(res.body).toMatchObject({ error: { details: [{ field: "title" }] } });
    });

    it("returns 400 for unknown fields", async () => {
      await request(app).post("/api/todos").send({ title: "Valid", done: true }).expect(400);
    });

    it("returns 400 for malformed JSON", async () => {
      const res = await request(app)
        .post("/api/todos")
        .set("Content-Type", "application/json")
        .send('{"title": ')
        .expect(400);

      expect(res.body).toMatchObject({ error: { code: "INVALID_JSON" } });
    });
  });

  describe("GET /api/todos", () => {
    it("returns all todos", async () => {
      await createTodo({ title: "One" });
      await createTodo({ title: "Two" });

      const res = await request(app).get("/api/todos").expect(200);

      expect(res.body).toHaveLength(2);
    });
  });

  describe("GET /api/todos/:id", () => {
    it("returns a single todo", async () => {
      const id = await createTodo({ title: "Find me" });

      const res = await request(app).get(`/api/todos/${id}`).expect(200);

      expect(res.body).toMatchObject({ title: "Find me" });
    });

    it("returns 404 for an unknown id", async () => {
      const res = await request(app).get(`/api/todos/${UNKNOWN_ID}`).expect(404);

      expect(res.body).toMatchObject({ error: { code: "TODO_NOT_FOUND" } });
    });

    it("returns 400 for a malformed id", async () => {
      await request(app).get("/api/todos/not-a-uuid").expect(400);
    });
  });

  describe("PUT /api/todos/:id", () => {
    it("updates title and description", async () => {
      const id = await createTodo({ title: "Draft", description: "Old" });

      const res = await request(app)
        .put(`/api/todos/${id}`)
        .send({ title: "Final", description: "" })
        .expect(200);

      expect(res.body).toMatchObject({ title: "Final" });
      expect(res.body).not.toHaveProperty("description");
    });

    it("returns 400 for an empty body", async () => {
      const id = await createTodo({ title: "Draft" });

      await request(app).put(`/api/todos/${id}`).send({}).expect(400);
    });
  });

  describe("PATCH /api/todos/:id/done", () => {
    it("toggles done back and forth", async () => {
      const id = await createTodo({ title: "Toggle me" });

      const first = await request(app).patch(`/api/todos/${id}/done`).expect(200);
      const second = await request(app).patch(`/api/todos/${id}/done`).expect(200);

      expect(first.body).toMatchObject({ done: true });
      expect(second.body).toMatchObject({ done: false });
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("deletes a todo and returns 204", async () => {
      const id = await createTodo({ title: "Delete me" });

      await request(app).delete(`/api/todos/${id}`).expect(204);
      await request(app).get(`/api/todos/${id}`).expect(404);
    });

    it("returns 404 when deleting an unknown id", async () => {
      await request(app).delete(`/api/todos/${UNKNOWN_ID}`).expect(404);
    });
  });

  it("returns 404 JSON for unknown routes", async () => {
    const res = await request(app).get("/api/nope").expect(404);

    expect(res.body).toMatchObject({ error: { code: "ROUTE_NOT_FOUND" } });
  });
});