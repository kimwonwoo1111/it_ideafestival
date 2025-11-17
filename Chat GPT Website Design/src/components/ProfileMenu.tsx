import {
  User,
  FileText,
  Bookmark,
  Settings,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ProfileMenuProps {
  onMyFactsClick: () => void;
  onSavedClick: () => void;
}

export function ProfileMenu({ onMyFactsClick, onSavedClick }: ProfileMenuProps) {
  const handleMenuClick = (action: string) => {
    console.log(`Clicked: ${action}`);
    
    if (action === "my-facts") {
      onMyFactsClick();
    } else if (action === "saved") {
      onSavedClick();
    }
    // TODO: Implement other menu actions
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
          <User className="w-5 h-5 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => handleMenuClick("my-facts")}
          className="cursor-pointer"
        >
          <FileText className="w-4 h-4 mr-2" />
          <span>내가 올린 컨텐츠</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleMenuClick("saved")}
          className="cursor-pointer"
        >
          <Bookmark className="w-4 h-4 mr-2" />
          <span>저장된 컨텐츠</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleMenuClick("settings")}
          className="cursor-pointer"
        >
          <Settings className="w-4 h-4 mr-2" />
          <span>설정</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleMenuClick("logout")}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}