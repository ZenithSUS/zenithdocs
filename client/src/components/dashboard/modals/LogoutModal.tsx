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
import useAuthStore from "@/features/auth/auth.store";
import useAuth from "@/features/auth/useAuth";
import { handleApiError } from "@/helpers/api-error";
import { AxiosError } from "@/types/api";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

interface HeaderDropDownProps {
  userId: string;
}

export function LogoutModal({ userId }: HeaderDropDownProps) {
  const router = useRouter();

  const { setUserId, setAccessToken } = useAuthStore();
  const { logoutMutation } = useAuth();
  const { mutateAsync: logout } = logoutMutation;

  const handleLogout = useCallback(async () => {
    try {
      await logout(userId);
      setUserId(null);
      setAccessToken(null);
      router.push("/login");
    } catch (error) {
      const err = error as AxiosError;
      handleApiError(err, "Failed to log out");
    }
  }, [logout, userId, setUserId, setAccessToken, router]);

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
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="text-black cursor-pointer"
            onClick={handleLogout}
          >
            Sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LogoutModal;
