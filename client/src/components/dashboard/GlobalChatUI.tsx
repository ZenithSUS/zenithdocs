import { User } from "@/types/user";
import { Zap } from "lucide-react";
import GlobalChat from "@/components/dashboard/globalchat";

interface GlobalChatProps {
  user: User | null;
  chatBotOpen: boolean;
  setChatBotOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function GlobalChatUI({ user, chatBotOpen, setChatBotOpen }: GlobalChatProps) {
  return (
    <>
      {chatBotOpen ? (
        <div className="fixed bottom-5 right-5 z-50">
          <GlobalChat user={user ?? null} setIsOpen={setChatBotOpen} />
        </div>
      ) : (
        <div className="bg-background rounded-full p-2 border border-primary fixed bottom-5 right-5 z-50 hover:bg-primary/10 hover:scale-105 transition-transform">
          <Zap
            onClick={() => setChatBotOpen(true)}
            className="cursor-pointer hover:scale-105 transition-transform"
            size={20}
            strokeWidth={2}
          />
        </div>
      )}
    </>
  );
}

export default GlobalChatUI;
