import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Link } from "react-router";
import { ApiError, getErrorMessage } from "../../../shared/api/ApiError.ts";
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  todoFormSchema,
  type TodoFormInput,
  type TodoFormValues,
} from "../schemas.ts";

interface TodoFormProps {
  /** Starting values: empty for create, the existing todo for edit. */
  defaultValues?: TodoFormInput;
  submitLabel: string;
  /** Where Cancel goes. */
  cancelTo: string;
  /** Saves the todo. Throwing an ApiError shows its messages in the form. */
  onSubmit: (values: TodoFormValues) => Promise<void>;
}

/**
 * Form for creating and editing a todo.
 *
 * Validates in the browser first (instant feedback), then maps any errors
 * the server returns onto the matching fields, so both kinds of error
 * look the same to the user.
 */
export function TodoForm({
  defaultValues = { title: "", description: "" },
  submitLabel,
  cancelTo,
  onSubmit,
}: TodoFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormInput, unknown, TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues,
  });

  // useWatch re-renders only when this field changes (for the character counter).
  const descriptionLength = useWatch({ control, name: "description" }).length;

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      showServerError(error);
    }
  });

  /** Puts server errors on their field when possible, otherwise above the form. */
  function showServerError(error: unknown) {
    if (error instanceof ApiError) {
      const titleMessage = error.fieldMessage("title");
      const descriptionMessage = error.fieldMessage("description");

      if (titleMessage) setError("title", { message: titleMessage });
      if (descriptionMessage) setError("description", { message: descriptionMessage });
      if (titleMessage || descriptionMessage) return;
    }
    setError("root.server", { message: getErrorMessage(error) });
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void submit(event);
      }}
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-6"
    >
      {errors.root?.server && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {errors.root.server.message}
        </p>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          type="text"
          autoFocus
          maxLength={TITLE_MAX_LENGTH}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? "title-error" : undefined}
          {...register("title")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 aria-invalid:border-red-500"
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-600">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="description" className="block text-sm font-medium">
            Description <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <span className="text-xs text-slate-500">
            {descriptionLength}/{DESCRIPTION_MAX_LENGTH}
          </span>
        </div>
        <textarea
          id="description"
          rows={4}
          maxLength={DESCRIPTION_MAX_LENGTH}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? "description-error" : undefined}
          {...register("description")}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 aria-invalid:border-red-500"
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Link to={cancelTo} className="rounded-md px-4 py-2 text-slate-600 hover:bg-slate-100">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}