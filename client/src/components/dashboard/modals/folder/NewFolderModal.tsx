import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useFolder from "@/features/folder/useFolder";
import { handleApiError, handleFormError } from "@/helpers/api-error";
import { AxiosError } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface NewFolderModalProps {
  userId: string;
  text?: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
  onRefresh?: (scope: "all" | "overview" | "user") => void;
}

const folderSchema = z.object({
  name: z.string().min(1, "Folder name is required."),
});

type FolderForm = z.infer<typeof folderSchema>;

const NewFolderModal = ({
  userId,
  text,
  variant,
  onRefresh,
}: NewFolderModalProps) => {
  const { createFolderMutation } = useFolder(userId);
  const {
    mutateAsync: createFolder,
    isPending,
    isError,
  } = createFolderMutation;

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, formState, reset, setError } =
    useForm<FolderForm>({
      resolver: zodResolver(folderSchema),
    });

  const createNewFolder = useCallback(async (data: FolderForm) => {
    try {
      setErrorMessage("");
      await createFolder({
        name: data.name,
        user: userId,
      });

      if (onRefresh) onRefresh("overview");

      reset();
      toast.success("Folder created successfully!");
      setOpen(false);
    } catch (error) {
      const err = error as AxiosError;
      const data = err.response?.data;
      setErrorMessage(data?.message || "");

      // Handle form errors
      handleFormError(data?.errors, setError);
      if (!data?.errors) handleApiError(err, "Something went wrong");
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className="text-black font-semibold">
          {text || "New Folder"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription>
            Enter the name of the new folder
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(createNewFolder)}
          className="flex flex-col gap-2"
        >
          <Input
            placeholder="Folder Name"
            type="text"
            className="px-2 py-2"
            {...register("name")}
          />

          {formState.errors.name && (
            <p className="text-red-500 text-xs">
              {formState.errors.name.message}
            </p>
          )}

          {isError && <p className="text-red-500 text-xs">{errorMessage}</p>}
          <div className="flex md:flex-row flex-col md:justify-end gap-2">
            <Button
              type="submit"
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-black sm:flex-none flex-1"
              disabled={isPending}
            >
              Create
            </Button>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none flex-1"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewFolderModal;
