"use client";
import React from "react";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, User, User2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { IUser } from "@/interface/User.interface";
import useAuth from "@/hooks/useAuth";

interface AvatarMenuProps {
  user: IUser;
}

const AvatarMenu = ({ user }: AvatarMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { AdminLogOut, ClientLogOut } = useAuth();
  const HandleLogout = async () => {
    user.Role == "Admin" ? await AdminLogOut() : await ClientLogOut();
    location.reload();
  };
  if (user)
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User2 />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 flex flex-col gap-1"
          align="end"
          forceMount
        >
          <DropdownMenuItem className="flex flex-col items-start ">
            <div className="text-xs font-medium text-muted-foreground">
              Signed in as
            </div>

            <div className="text-sm font-medium truncate max-w-full overflow-hidden">
              {user?.email || "No email provided"}
            </div>
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem
            onClick={() => {
              location.href = `${
                process.env.NEXT_PUBLIC_DASHBOARD_URL
              }/${user?.Role?.toLocaleLowerCase()}` as string;
            }}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={HandleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

export default AvatarMenu;
