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
  const { createFolderMutation } = useFolder();
  const {
    mutateAsync: createFolder,
    isPending,
    isError,
    error,
  } = createFolderMutation(userId);

  const [open, setOpen] = useState(false);

  const { register, handleSubmit, formState, reset } = useForm<FolderForm>({
    resolver: zodResolver(folderSchema),
  });

  const createNewFolder = useCallback(async (data: FolderForm) => {
    try {
      await createFolder({
        name: data.name,
        user: userId,
      });

      if (onRefresh) onRefresh("overview");

      reset();
      toast.success("Folder created successfully!");
      setOpen(false);
    } catch (error) {
      console.log("Error creating folder:", error);
    }
  }, []);

  const errorMessage = useMemo(
    () =>
      error?.response.data.message || "Something went wrong. Please try again.",
    [],
  );

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
          <div className="flex flex-row gap-2">
            <Button
              type="submit"
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-black"
              disabled={isPending}
            >
              Create
            </Button>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
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
