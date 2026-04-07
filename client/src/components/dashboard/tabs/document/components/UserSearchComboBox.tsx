import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SquarePlus, X } from "lucide-react";
import { useUserMatchByEmail } from "@/features/user/useUserMatchByEmail";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserSearchComboboxProps {
  onChange: (id: string) => void;
  placeholder?: string;
  initialEmail?: string;
  excludeIds?: (string | undefined)[];
}

type EmailMatch = z.infer<typeof emailMatchSchema>;

const emailMatchSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format."),
});

export function UserSearchCombobox({
  onChange,
  placeholder = "Search by email...",
  initialEmail,
  excludeIds = [],
}: UserSearchComboboxProps) {
  const [isSelected, setIsSelected] = useState(!!initialEmail);

  const { register, handleSubmit, watch, setValue } = useForm<EmailMatch>({
    resolver: zodResolver(emailMatchSchema),
    defaultValues: { email: initialEmail ?? "" },
  });

  const email = watch("email");
  const { mutate: matchUser, isPending } = useUserMatchByEmail(email);

  const handleMatchUser = (_data: EmailMatch) => {
    matchUser(undefined, {
      onSuccess: (user) => {
        if (excludeIds.includes(user._id)) {
          toast.error("You cannot add the same user twice.");
          return;
        }
        onChange(user._id);
        setIsSelected(true);
      },
      onError: () => {
        toast.error("User not found.");
      },
    });
  };

  const handleClear = () => {
    onChange("");
    setIsSelected(false);
    setValue("email", "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(handleMatchUser)();
    }
  };

  return (
    <div className="relative">
      <div className="relative flex gap-2">
        <Input
          {...register("email")}
          readOnly={isSelected}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className={`bg-white/4 border-white/12 text-text/80 font-sans text-[12px] ${
            isSelected ? "cursor-default select-none pr-7" : ""
          }`}
        />
        {isSelected && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleClear();
            }}
            className="absolute right-[52px] top-1/2 -translate-y-1/2 text-text/40 hover:text-text/80 transition-colors"
          >
            <X size={13} className="text-red-500" />
          </button>
        )}
        <Button
          type="button"
          disabled={isPending || isSelected}
          onClick={handleSubmit(handleMatchUser)}
          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SquarePlus size={13} />
        </Button>
      </div>
    </div>
  );
}
