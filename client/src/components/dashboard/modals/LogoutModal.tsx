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
import { useCallback } from "react";

interface HeaderDropDownProps {
  userId: string;
}

export function LogoutModal({ userId }: HeaderDropDownProps) {
  const { logoutMutation } = useAuth();
  const { mutateAsync: logout } = logoutMutation;

  const handleLogout = useCallback(async () => {
    try {
      await logout(userId);
    } catch (error) {
      console.log("Error logging out:", error);
    }
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Sign out</Button>
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
          <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LogoutModal;
