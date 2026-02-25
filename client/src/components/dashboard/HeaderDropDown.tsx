import useAuth from "@/features/auth/useAuth";
import "@/app/globals.css";
import LogoutModal from "./modals/LogoutModal";

interface HeaderDropDownProps {
  userId: string;
  email: string;
  plan: string;
}

function HeaderDropDown({ userId, email, plan }: HeaderDropDownProps) {
  return (
    <div className="absolute top-full right-0 mt-2 rounded-sm bg-background border border-white/6 flex flex-col gap-3 px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full text-primary border border-primary flex items-center justify-center">
          {email[0].toUpperCase()}
        </div>

        <div className="flex flex-col items-start gap-1">
          <p className="text-sm font-semibold">{email}</p>
          <p className="text-xs text-text/50">{plan.toUpperCase()} PLAN</p>
        </div>
      </div>
      <LogoutModal userId={userId} />
    </div>
  );
}

export default HeaderDropDown;
