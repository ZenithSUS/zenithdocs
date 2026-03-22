"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDocumentShare from "@/features/document-share/useDocumentShare";
import { handleApiError, handleFormError } from "@/helpers/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "@/types/api";
import {
  BookA,
  Globe2,
  Lock,
  PenIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { UserSearchCombobox } from "../../tabs/document/components/UserSearchComboBox";
import { DocumentShareInfo } from "@/types/doc";

const permissionEnum = z.enum(["read", "write"], {
  error: () => ({ message: "Select a permission" }),
});

const shareDocumentSchema = z
  .object({
    documentId: z.string().min(1),
    ownerId: z.string().min(1),
    type: z.enum(["public", "private"], {
      error: () => ({ message: "Select a visibility type" }),
    }),
    publicPermission: permissionEnum.optional(),
    allowedUsers: z
      .array(
        z.object({
          userId: z.string().min(1, "User email is required"),
          permission: permissionEnum,
        }),
      )
      .optional(),
    allowDownload: z.boolean().optional(),
    expiresAt: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          return !isNaN(date.getTime()) && date > new Date();
        },
        { message: "Expiry date must be in the future" },
      ),
  })
  .superRefine((data, ctx) => {
    if (data.type === "private") {
      if (!data.allowedUsers || data.allowedUsers.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Add at least one user for a private share",
          path: ["allowedUsers"],
        });
      }
    }
  });

export type ShareDocumentSchema = z.infer<typeof shareDocumentSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ShareDocumentModalProps {
  userId: string;
  document: DocumentShareInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] text-red-400">{message}</p>;
}

function PermissionSelect({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (val: string) => void;
}) {
  return (
    <Select onValueChange={onChange} value={value ?? ""}>
      <SelectTrigger className="w-full bg-white/4 border border-white/12 text-text/70 font-sans text-[12px]">
        <SelectValue placeholder="Permission" />
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={4}
        defaultValue={"read"}
        className="bg-background"
      >
        <SelectItem value="read" className="font-sans text-[12px]">
          <BookA className="mr-2" color="#c9a227" /> Read
        </SelectItem>
        <SelectItem value="write" className="font-sans text-[12px]">
          <PenIcon className="mr-2" color="#c9a227" /> Write
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ShareDocumentModal({
  userId,
  document,
  open,
  onOpenChange,
  onSuccess,
}: ShareDocumentModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setError,
    getValues,
    formState: { errors },
  } = useForm<ShareDocumentSchema>({
    resolver: zodResolver(shareDocumentSchema),
    defaultValues: {
      documentId: document.id,
      ownerId: userId,
      type: "public",
      publicPermission: "read",
      allowedUsers: [],
      allowDownload: false,
      expiresAt: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "allowedUsers",
  });

  const { createDocumentShareMutation } = useDocumentShare(userId);
  const { mutateAsync: createDocShare, isPending } =
    createDocumentShareMutation;

  const shareType = watch("type");

  const onSubmit = async (data: ShareDocumentSchema) => {
    try {
      const createDocData = {
        ...data,
        // datetime-local "YYYY-MM-DDTHH:mm" → full ISO "2026-03-19T12:56:18.211+00:00"
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt).toISOString()
          : undefined,
        allowedUsers: data.type === "private" ? data.allowedUsers : undefined,
        publicPermission:
          data.type === "public" ? data.publicPermission : undefined,
      };

      await createDocShare({
        data: createDocData,
        document: document,
      });
      toast.success("Document shared successfully");
      reset();
      onOpenChange(false);
    } catch (error) {
      const err = error as AxiosError;
      const errData = err.response?.data;
      handleFormError(errData?.errors, setError);
      if (!errData?.errors) handleApiError(err, "Could not share document");
    } finally {
      if (onSuccess) onSuccess();
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#1a1a1a] border border-white/12 text-text overflow-hidden">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          {/* Hidden identity fields */}
          <input type="hidden" {...register("documentId")} />
          <input type="hidden" {...register("ownerId")} />

          {/* ── Header ─────────────────────────────────────────────────── */}
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="text-text">Share document</DialogTitle>
            <DialogDescription className="text-text/50">
              Sharing{" "}
              <span className="font-medium text-text/80">
                "{document.title}"
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* ── Scrollable body ────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 pb-2">
            <FieldGroup className="space-y-5">
              {/* ─── Visibility ───────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label htmlFor="type" className="text-text/70 text-[12px]">
                    Visibility
                  </Label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          id="type"
                          className="w-full bg-white/4 border border-white/12 text-text/70 font-sans text-[12px]"
                        >
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={4}
                          className="bg-background"
                        >
                          <SelectItem
                            value="public"
                            className="font-sans text-[12px]"
                          >
                            <Globe2 className="mr-2" color="#c9a227" /> Public
                          </SelectItem>
                          <SelectItem
                            value="private"
                            className="font-sans text-[12px]"
                          >
                            <Lock className="mr-2" color="#c9a227" /> Private
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError message={errors.type?.message} />
                </Field>

                <Field>
                  <Label
                    htmlFor="expiresAt"
                    className="text-text/70 text-[12px]"
                  >
                    Expires at <span className="text-text/30">(optional)</span>
                  </Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    {...register("expiresAt")}
                    className="bg-white/4 border-white/12 text-text/70 font-sans text-[12px]"
                  />
                  <FieldError message={errors.expiresAt?.message} />
                </Field>
              </div>

              {/* Public permission — only shown when public */}
              {shareType === "public" && (
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label className="text-text/70 text-[12px]">
                      Public permission
                    </Label>
                    <Controller
                      control={control}
                      name="publicPermission"
                      render={({ field }) => (
                        <PermissionSelect
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <FieldError message={errors.publicPermission?.message} />
                  </Field>
                </div>
              )}
              {/* Options (allow download + allow edit) */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label className="text-text/70 text-[12px]">Options</Label>
                  <div className="mt-2 space-y-2.5">
                    <label className="flex items-center gap-2 text-[12px] text-text/60 cursor-pointer select-none">
                      <Controller
                        control={control}
                        name="allowDownload"
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      Allow download
                    </label>
                  </div>
                </Field>
              </div>

              {/* Allowed users — private only (full width) */}
              {shareType === "private" && (
                <Field>
                  <Label className="text-text/70 text-[12px]">
                    Allowed users
                  </Label>

                  <div className="mt-1 space-y-2">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-[1fr_120px_32px] gap-2 items-start"
                      >
                        {/* User ID */}
                        <div>
                          <Controller
                            control={control}
                            name={`allowedUsers.${index}.userId`}
                            render={({ field }) => (
                              <UserSearchCombobox
                                value={field.value || ""}
                                onChange={field.onChange}
                                excludeIds={fields
                                  .map((_, i) =>
                                    getValues(`allowedUsers.${i}.userId`),
                                  )
                                  .filter((id) => id !== field.value)}
                              />
                            )}
                          />
                          <FieldError
                            message={
                              errors.allowedUsers?.[index]?.userId?.message
                            }
                          />
                        </div>

                        {/* Permission */}
                        <div>
                          <Controller
                            control={control}
                            name={`allowedUsers.${index}.permission`}
                            render={({ field: permField }) => (
                              <PermissionSelect
                                value={permField.value}
                                onChange={permField.onChange}
                              />
                            )}
                          />
                          <FieldError
                            message={
                              errors.allowedUsers?.[index]?.permission?.message
                            }
                          />
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-1.5 flex items-center justify-center text-text/30 hover:text-red-400 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <FieldError
                    message={
                      errors.allowedUsers?.message ??
                      (errors.allowedUsers?.root?.message as string | undefined)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => append({ userId: "", permission: "read" })}
                    className="mt-2 flex items-center gap-1 text-[12px] text-text/40 hover:text-text/70 transition-colors"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    Add user
                  </button>
                </Field>
              )}
            </FieldGroup>
          </div>

          {/* ── Footer ─────────────────────────────────────────────────── */}
          <DialogFooter className="px-6 py-4 border-t border-white/8 shrink-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                className="font-sans text-[12px]"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="font-sans text-[12px]"
            >
              {isPending ? "Sharing…" : "Share document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDocumentModal;
