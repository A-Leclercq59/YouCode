import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LogoutButton from "@/features/auth/LogoutButton";
import { getAuthSession } from "@/lib/auth";

const AccountPage = async () => {
  const session = await getAuthSession();

  if (!session) {
    throw new Error("No Session found");
  }

  return (
    <Card className="max-w-lg m-auto mt-4">
      <CardHeader className="flex flex-row space-y-0 gap-4">
        <Avatar>
          <AvatarFallback>{session.user.email?.[0]}</AvatarFallback>
          {session.user.image && (
            <AvatarImage src={session.user.image} alt="user image" />
          )}
        </Avatar>
        <div className="flex flex-col gap-1">
          <CardTitle>{session.user.email}</CardTitle>
          <CardDescription>{session.user.name}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Link
          className={buttonVariants({ variant: "outline", size: "lg" })}
          href="/account/settings"
        >
          Settings
        </Link>
        <Link
          className={buttonVariants({ variant: "outline", size: "lg" })}
          href="/admin"
        >
          Admin
        </Link>
      </CardContent>
      <CardFooter className="flex flex-row-reverse">
        <LogoutButton />
      </CardFooter>
    </Card>
  );
};

export default AccountPage;
