"use client";

import { Session } from "next-auth";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import Loader from "@/components/ui/loader";

export type LoggedInButtonProps = {
  user: Session["user"];
};

const LoggedInButton = (props: LoggedInButtonProps) => {
  const mutation = useMutation({
    mutationFn: async () => {
      signOut();
    },
  });

  return (
    <DropdownMenu>
      <AlertDialog>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>{props.user?.name?.[0]}</AvatarFallback>
              {props.user.image && (
                <AvatarImage
                  src={props.user.image}
                  alt={props.user.name ?? "user picture"}
                />
              )}
            </Avatar>
            {props.user.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <LogOut className="mr-2" size={12} />
              Logout
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Cancel</Button>
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? (
                <Loader className="mr-2" size={12} />
              ) : (
                <LogOut className="mr-2" size={12} />
              )}
              Logout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
};

export default LoggedInButton;