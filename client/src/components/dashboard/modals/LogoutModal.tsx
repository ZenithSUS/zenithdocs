import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useAuth from "@/features/auth/useAuth";
import { AxiosError } from "@/types/api";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

interface HeaderDropDownProps {
  userId: string;
}

export function LogoutModal({ userId }: HeaderDropDownProps) {
  const router = useRouter();
  const { logoutMutation } = useAuth();
  const { mutateAsync: logout } = logoutMutation;

  const handleLogout = useCallback(async () => {
    try {
      await logout(userId);
      router.push("/login");
    } catch (error) {
      const err = error as AxiosError;
      toast.error(err.response?.data?.message ?? "Failed to logout");
    }
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="text-black">Sign out</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will log you out of your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="text-black" onClick={handleLogout}>
            Sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LogoutModal;
