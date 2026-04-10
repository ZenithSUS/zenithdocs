import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useFolder from "@/features/folder/useFolder";
import { handleApiError, handleFormError } from "@/helpers/api-error";
import { AxiosError } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface RenameFolderModalProps {
  userId: string;
  folderId: string;
  folderName: string;
}

const folderRenameSchema = z.object({
  name: z.string().min(1, "Folder name is required."),
});

type FolderForm = z.infer<typeof folderRenameSchema>;

function RenameFolderModal({
  userId,
  folderId,
  folderName,
}: RenameFolderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { updateFolderMutation } = useFolder(userId);
  const { mutateAsync: updateFolder } = updateFolderMutation;

  const { register, handleSubmit, formState, setError } = useForm<FolderForm>({
    resolver: zodResolver(folderRenameSchema),
    defaultValues: { name: folderName },
  });

  const renameFolder = useCallback(async (data: FolderForm) => {
    try {
      await updateFolder({
        id: folderId,
        data: {
          name: data.name,
        },
      });

      toast.success("Folder renamed successfully!");
      setIsOpen(false);
    } catch (error) {
      const err = error as AxiosError;
      const data = err.response?.data;

      // Handle form errors
      handleFormError(data?.errors, setError);
      if (!data?.errors) handleApiError(err, "Something went wrong");
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="p-2 border border-white/20 rounded-lg">
          <Pencil
            className="text-text/40 hover:text-text/70 text-xl"
            size={20}
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription></DialogDescription>
          <form
            onSubmit={handleSubmit(renameFolder)}
            className="flex flex-col gap-2"
          >
            <Field>
              <FieldLabel htmlFor="foldername">Folder Name</FieldLabel>
              <Input
                id="foldername"
                type="text"
                placeholder="Folder name"
                {...register("name")}
              />
            </Field>
            {formState.errors.name && (
              <div className="text-red-500 text-sm">
                {formState.errors.name.message}
              </div>
            )}

            <div className="flex md:flex-row flex-col md:justify-end gap-2">
              <Button
                type="submit"
                disabled={formState.isSubmitting}
                className="flex-1 sm:flex-none text-black"
              >
                {formState.isSubmitting ? "Renaming..." : "Rename"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={closeModal}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default RenameFolderModal;
