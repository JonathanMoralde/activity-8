"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions";
import { toast } from "sonner";

type Props = {};

const Navbar = (props: Props) => {
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to log out. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  return (
    <NavigationMenu className="max-w-full w-full justify-end fixed h-[10vh] px-20">
      <NavigationMenuList className=" w-full">
        <NavigationMenuItem>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
