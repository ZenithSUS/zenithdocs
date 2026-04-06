import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useLearningSet from "@/features/learning-sets/useLearningSet";
import { handleApiError, handleFormError } from "@/helpers/api-error";
import { AxiosError } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type RenameLearningSetForm = z.infer<typeof renameLearningSetSchema>;

const renameLearningSetSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
});

interface RenameLearningSetModalProps {
  userId: string;
  page: number;
  learningSetId: string;
  learningSetName: string;
  defaultOpen?: boolean;
  onClose?: () => void;
}

function RenameLearningSetModal({
  userId,
  page,
  learningSetId,
  learningSetName,
  defaultOpen = false,
  onClose,
}: RenameLearningSetModalProps) {
  const [open, setOpen] = useState(defaultOpen);

  const { updateLearningSetMutation } = useLearningSet(userId, page);
  const { mutateAsync: updateLearningSet, isPending: isUpdating } =
    updateLearningSetMutation;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<RenameLearningSetForm>({
    resolver: zodResolver(renameLearningSetSchema),
    defaultValues: {
      title: learningSetName,
    },
  });

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) onClose?.();
    },
    [onClose],
  );

  const handleRename = useCallback(
    async (data: RenameLearningSetForm) => {
      try {
        await updateLearningSet({ id: learningSetId, data });
        reset();
        toast.success("Learning set renamed successfully!");
        handleOpenChange(false);
      } catch (error) {
        const err = error as AxiosError;
        const errData = err.response?.data;
        handleFormError(errData?.errors, setError);
        if (!errData?.errors)
          handleApiError(err, "Could not rename learning set");
      }
    },
    [updateLearningSet, learningSetId, reset, setError, handleOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Trigger is only rendered when used standalone (not from dropdown) */}
      {!defaultOpen && (
        <DialogTrigger asChild>
          <PencilIcon className="cursor-pointer w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/10 p-1.5 rounded-lg" />
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(handleRename)}>
          <DialogHeader>
            <DialogTitle>Rename Learning Set</DialogTitle>
            <DialogDescription>
              Make changes to your learning set
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("title")} type="text" />
            </Field>
            {errors.title && (
              <p className="text-error-500 text-sm">{errors.title.message}</p>
            )}
          </FieldGroup>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isUpdating}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isUpdating}
              className="cursor-pointer text-black"
            >
              {isUpdating ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RenameLearningSetModal;
