"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  CalendarIcon,
  Globe2,
  Lock,
  PlusIcon,
  TrashIcon,
  X,
} from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { UserSearchCombobox } from "../../tabs/document/components/UserSearchComboBox";
import { DocumentShare } from "@/types/document-share";
import { DocumentShareInfo } from "@/types/doc";
import toLocalISOString from "@/utils/local-timezone";

const permissionEnum = z.enum(["read"], {
  error: () => ({ message: "Select a permission" }),
});

const editShareDocumentSchema = z
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

export type ShareDocumentSchema = z.infer<typeof editShareDocumentSchema>;

interface EditShareDocumentModalProps {
  userId: string;
  documentShare: DocumentShare;
  documentInfo: DocumentShareInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] text-red-400">{message}</p>;
}

function EditShareDocumentModal({
  userId,
  documentShare,
  documentInfo,
  open,
  onOpenChange,
  onSuccess,
}: EditShareDocumentModalProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ShareDocumentSchema>({
    resolver: zodResolver(editShareDocumentSchema),
    defaultValues: {
      documentId:
        typeof documentShare.documentId === "string"
          ? documentShare.documentId
          : documentShare.documentId._id,
      ownerId: userId,
      type: documentShare.type,
      publicPermission: documentShare.publicPermission,
      allowedUsers: documentShare.allowedUsers?.map((user) => ({
        userId: typeof user.userId === "string" ? user.userId : user.userId._id,
        permission: user.permission,
        email: typeof user.userId === "object" ? user.userId.email : undefined,
      })),
      allowDownload: documentShare.allowDownload,
      expiresAt: documentShare.expiresAt
        ? toLocalISOString(new Date(documentShare.expiresAt))
        : undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "allowedUsers",
  });

  const { updateDocumentShareMutation } = useDocumentShare(userId);
  const { mutateAsync: updateDocShare, isPending } =
    updateDocumentShareMutation;

  const shareType = watch("type");
  const expiresAtValue = watch("expiresAt");

  const onSubmit = async (data: ShareDocumentSchema) => {
    try {
      const updatedDocData = {
        ...data,
        expiresAt: data.expiresAt
          ? toLocalISOString(new Date(data.expiresAt))
          : null,
        allowedUsers: data.type === "private" ? data.allowedUsers : undefined,
        publicPermission:
          data.type === "public" ? data.publicPermission : undefined,
      };

      await updateDocShare({
        id: documentShare._id,
        data: updatedDocData,
        document: documentInfo,
      });
      toast.success("Document share updated successfully");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError;
      const errData = err.response?.data;
      handleFormError(errData?.errors, setError);
      if (!errData?.errors)
        handleApiError(
          err,
          "Could not update shared document. Please try again.",
        );
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
          <input type="hidden" {...register("documentId")} />
          <input type="hidden" {...register("ownerId")} />

          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="text-text">
              Edit shared document
            </DialogTitle>
            <DialogDescription className="text-text/50">
              Editing{" "}
              <span className="font-medium text-text/80">
                "{documentInfo.title}"
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-2">
            <FieldGroup className="space-y-5">
              {/* ─── Visibility + Expires at ───────────────────────────── */}
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

                {/* ─── Expires at — Calendar + Popover ──────────────── */}
                <Field>
                  <Label
                    htmlFor="expiresAt"
                    className="text-text/70 text-[12px]"
                  >
                    Expires at <span className="text-text/30">(optional)</span>
                  </Label>
                  <Controller
                    control={control}
                    name="expiresAt"
                    render={({ field }) => {
                      const dateValue = expiresAtValue
                        ? new Date(expiresAtValue)
                        : undefined;

                      const handleDaySelect = (day: Date | undefined) => {
                        if (!day) {
                          field.onChange(undefined);
                          return;
                        }
                        const existing = field.value
                          ? new Date(field.value)
                          : null;
                        const merged = new Date(day);
                        if (existing) {
                          merged.setHours(
                            existing.getHours(),
                            existing.getMinutes(),
                          );
                        }
                        field.onChange(merged.toISOString());
                      };

                      const handleTimeChange = (
                        e: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        const [hours, minutes] = e.target.value
                          .split(":")
                          .map(Number);
                        const base = dateValue
                          ? new Date(dateValue)
                          : new Date();
                        base.setHours(hours ?? 0, minutes ?? 0, 0, 0);
                        field.onChange(base.toISOString());
                      };

                      const handleClear = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setValue("expiresAt", undefined, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        field.onChange(undefined);
                      };

                      return (
                        <Popover
                          open={calendarOpen}
                          onOpenChange={setCalendarOpen}
                        >
                          <PopoverTrigger asChild>
                            <button
                              id="expiresAt"
                              type="button"
                              className={[
                                "flex h-9 w-full items-center justify-between rounded-md border px-3",
                                "bg-white/4 border-white/12 font-sans text-[12px]",
                                "transition-colors hover:bg-white/6",
                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20",
                                dateValue ? "text-text/80" : "text-text/30",
                              ].join(" ")}
                            >
                              <span className="flex items-center gap-2">
                                <CalendarIcon size={13} color="#c9a227" />
                                {dateValue
                                  ? format(dateValue, "MMM d, yyyy 'at' HH:mm")
                                  : "Pick a date & time"}
                              </span>
                              {dateValue && (
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onMouseDown={handleClear}
                                  className="text-text/30 hover:text-text/70 transition-colors cursor-pointer"
                                  onPointerDown={(e) => e.stopPropagation()}
                                >
                                  <X size={12} />
                                </span>
                              )}
                            </button>
                          </PopoverTrigger>

                          <PopoverContent
                            className="w-auto p-0 border border-white/12 bg-[#1a1a1a] shadow-xl"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={dateValue}
                              onSelect={handleDaySelect}
                              disabled={{ before: new Date() }}
                              autoFocus
                              classNames={{
                                months: "p-3",
                                head_cell:
                                  "text-text/30 text-[11px] font-normal w-9",
                                cell: "w-9 h-9 text-[12px]",
                                day: [
                                  "h-9 w-9 rounded-md text-text/70 text-[12px] font-sans",
                                  "hover:bg-white/8 hover:text-text/90 transition-colors",
                                ].join(" "),
                                day_selected:
                                  "bg-primary text-black hover:bg-primary hover:text-black font-medium",
                                day_today:
                                  "border border-white/20 text-text/90",
                                day_outside: "text-text/20",
                                day_disabled: "text-text/15 cursor-not-allowed",
                                nav_button:
                                  "h-7 w-7 rounded-md text-text/40 hover:bg-white/8 hover:text-text/80 transition-colors",
                                caption:
                                  "text-text/70 text-[12px] font-medium font-sans",
                              }}
                            />

                            {/* Time picker */}
                            <div className="border-t border-white/8 px-3 py-2.5 flex items-center gap-2">
                              <span className="text-text/30 text-[11px] font-sans shrink-0">
                                Time
                              </span>
                              <Input
                                type="time"
                                value={
                                  dateValue
                                    ? `${String(dateValue.getHours()).padStart(2, "0")}:${String(dateValue.getMinutes()).padStart(2, "0")}`
                                    : ""
                                }
                                onChange={handleTimeChange}
                                className="h-7 bg-white/4 border-white/12 text-text/70 font-sans text-[12px] px-2"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-7 px-3 text-[11px] font-sans text-text/50 hover:text-text/80 hover:bg-white/8 ml-auto"
                                onClick={() => setCalendarOpen(false)}
                              >
                                Done
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      );
                    }}
                  />
                  <FieldError message={errors.expiresAt?.message} />
                </Field>
              </div>

              {/* Options */}
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

              {/* Allowed users — private only */}
              {shareType === "private" && (
                <Field>
                  <Label className="text-text/70 text-[12px]">
                    Allowed users
                  </Label>

                  <div className="mt-1 space-y-2">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-[1fr_32px] gap-2 items-start"
                      >
                        {/* Hidden permission field — always "read" */}
                        <input
                          type="hidden"
                          {...register(`allowedUsers.${index}.permission`)}
                          value="read"
                        />

                        <div>
                          <Controller
                            control={control}
                            name={`allowedUsers.${index}.userId`}
                            render={({ field }) => (
                              <UserSearchCombobox
                                onChange={field.onChange}
                                excludeIds={fields
                                  .map((_, i) =>
                                    getValues(`allowedUsers.${i}.userId`),
                                  )
                                  .filter((id) => id !== field.value)}
                                initialEmail={
                                  typeof documentShare.allowedUsers?.[index]
                                    ?.userId === "object"
                                    ? documentShare.allowedUsers[index].userId
                                        .email
                                    : undefined
                                }
                              />
                            )}
                          />
                          <FieldError
                            message={
                              errors.allowedUsers?.[index]?.userId?.message
                            }
                          />
                        </div>

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
              className="font-sans text-black text-[12px]"
            >
              {isPending ? "Editing..." : "Edit shared document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditShareDocumentModal;
