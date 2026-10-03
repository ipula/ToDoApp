import { TodoDescription } from "./TodoDescription.ts";
import { TodoId } from "./TodoId.ts";
import { TodoTitle } from "./TodoTitle.ts";

/** Internal state of a todo, held as value objects. */
interface TodoProps {
  id: TodoId;
  title: TodoTitle;
  description: TodoDescription;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Plain data used to rebuild a todo that already exists (e.g. from the DB). */
export interface TodoSnapshot {
  id: string;
  title: string;
  description: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Fields that can be changed when editing. Omitted fields stay unchanged. */
export interface TodoChanges {
  title?: string;
  description?: string;
}

/**
 * Todo aggregate root.
 *
 * State is private and only changes through intention-revealing methods
 * (`edit`, `toggleDone`), so every change goes through the business rules.
 * `now` parameters default to the current time but can be passed in tests
 * to make timestamps deterministic.
 */
export class Todo {
  private constructor(private props: TodoProps) {}

  /** Creates a new todo. New todos always start as not done. */
  static create(input: { title: string; description?: string }, now: Date = new Date()): Todo {
    return new Todo({
      id: TodoId.generate(),
      title: TodoTitle.create(input.title),
      description: TodoDescription.create(input.description),
      done: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Rebuilds an existing todo from stored data. Values are re-validated. */
  static restore(snapshot: TodoSnapshot): Todo {
    return new Todo({
      id: TodoId.from(snapshot.id),
      title: TodoTitle.create(snapshot.title),
      description: TodoDescription.create(snapshot.description),
      done: snapshot.done,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    });
  }

  /**
   * Updates the title and/or description.
   * Both values are validated before either is applied, so an invalid
   * description never leaves the todo with only a new title.
   */
  edit(changes: TodoChanges, now: Date = new Date()): void {
    const title = changes.title !== undefined ? TodoTitle.create(changes.title) : this.props.title;
    const description =
      changes.description !== undefined
        ? TodoDescription.create(changes.description)
        : this.props.description;

    this.props = { ...this.props, title, description, updatedAt: now };
  }

  /** Flips the done status. */
  toggleDone(now: Date = new Date()): void {
    this.props = { ...this.props, done: !this.props.done, updatedAt: now };
  }

  get id(): TodoId {
    return this.props.id;
  }

  /** Plain-data view of the todo, used by mappers in outer layers. */
  toSnapshot(): TodoSnapshot {
    return {
      id: this.props.id.value,
      title: this.props.title.value,
      description: this.props.description.value,
      done: this.props.done,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
