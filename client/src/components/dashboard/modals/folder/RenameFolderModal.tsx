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
  const { updateFolderMutation } = useFolder();
  const { mutateAsync: updateFolder } = updateFolderMutation(userId);

  const { register, handleSubmit, formState, control } = useForm<FolderForm>({
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
      toast.error("Error renaming folder");
      console.error("Error renaming folder:", error);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Pencil className="text-text/40 hover:text-text/70 text-xl" size={20} />
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

            <div className="flex justify-start gap-2">
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Renaming..." : "Rename"}
              </Button>
              <Button variant="outline" type="button" onClick={closeModal}>
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
