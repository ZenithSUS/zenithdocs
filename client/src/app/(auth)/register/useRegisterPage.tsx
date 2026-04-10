import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import getPasswordStrength from "@/utils/password-strength";
import useAuth from "@/features/auth/useAuth";
import { AxiosError } from "@/types/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import config from "@/config/env";
import useMousePosition from "@/features/ui/useMousePostion";
import { handleFormError } from "@/helpers/api-error";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const useRegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const mousePos = useMousePosition();
  const formPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { registerMutation } = useAuth();
  const { isPending, mutateAsync } = registerMutation;

  useEffect(() => {
    const el = formPanelRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(() => {
      el.classList.add("panel-visible");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });
  const confirmValue = useWatch({
    control,
    name: "confirmPassword",
    defaultValue: "",
  });
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");

    try {
      const res = await mutateAsync(data);
      if (!res.success) throw new Error(res.message);

      toast.success(res.message);
      router.replace("/login");
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      setServerError(
        axiosError?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );

      // When the server returns validation errors
      if (axiosError.response?.data?.errors) {
        handleFormError(axiosError.response.data.errors, setError);
      }
    }
  };

  const handleOAuthRegister = useCallback(() => {
    window.location.href = `${config.api.baseUrl}/api/auth/google`;
  }, []);

  return {
    // UI
    mousePos,

    // Refs
    formPanelRef,

    // Form
    register,
    errors,

    // Handlers
    handleSubmit,
    handleOAuthRegister,
    onSubmit,

    // Values
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    serverError,
    isSubmitting,
    strength,
    passwordValue,
    confirmValue,
    isPending,
  };
};

export default useRegisterPage;
