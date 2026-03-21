import { toast } from "sonner";
import { AxiosError } from "@/types/api";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";

export const handleApiError = (err: AxiosError, fallback: string) => {
  const data = err.response?.data;

  if (data?.errors) {
    const message = data.errors
      .map((e: { field: string; message: string }) => e.message)
      .join(", ");
    toast.error(message);
  } else {
    toast.error(data?.message ?? fallback);
  }
};

export const handleFormError = <T extends FieldValues>(
  errors: { field: string; message: string }[] | undefined,
  setError: UseFormSetError<T>,
) => {
  if (!errors) return;

  for (const { field, message } of errors) {
    setError(field as Path<T>, { message });
  }
};
