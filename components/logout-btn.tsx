import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOutAction } from "@/app/actions/auth";

interface LogoutBtnProps {
  session: {
    user: {
      id : string;
      name: string;
      image?: string | null;
      email?: string | null;
    };
  };
}

export const LogoutBtn = async ({ session }: LogoutBtnProps) => {
  return (
    <main className=" fixed mt-10 right-6 md:right-10 cursor-pointer z-50 top-20">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              src={session?.user?.image || "https://github.com/shadcn.png"}
              alt={session?.user?.name}
            />
            <AvatarFallback>{session?.user?.name[0]}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" mr-10">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form action={signOutAction}>
              <Button className=" w-full">Logout</Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </main>
  );
};
