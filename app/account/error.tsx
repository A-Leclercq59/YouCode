"use client";
import { useEffect } from "react";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LoginButton from "@/features/auth/LoginButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="max-w-lg m-auto mt-4">
      <CardHeader>
        <CardTitle>You need to be logged in to view this page</CardTitle>
      </CardHeader>
      <CardFooter>
        <LoginButton />
      </CardFooter>
    </Card>
  );
}
