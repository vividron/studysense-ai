import { BookOpenText } from "lucide-react";
import NavItem from "./NavItem";
import UserProfile from "./UserProfile";

const AppLayout = ({ children }) => {

  return (
    <div className="h-screen flex flex-col bg-(--bg-main) text-white">
      <header className="hidden tablet:flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <BookOpenText className="text-white h-8 w-8" />
          <span className="text-xl font-bold">StudySense</span>
        </div>
        {/*top navbar*/}
        <NavItem variant={"desktop"} />
        {/*User Profile*/}
        <UserProfile />
      </header>

      {/*Main Content*/}
      <main className="relative flex-1 overflow-x-hidden overflow-y-auto px-4 tablet:px-8 py-6">
        {children}
      </main>

      {/*Bottom Nav (Mobile)*/}
      <NavItem variant={"mobile"} />
    </div>
  );
}

export default AppLayout;
