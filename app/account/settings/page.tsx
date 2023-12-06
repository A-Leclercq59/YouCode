import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { getRequiredAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import FormSettings from "./FormSettings";

const FormSchema = z.object({
  name: z.string().min(3).max(40),
  image: z.string().url(),
});

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getRequiredAuthSession();

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Account settings</LayoutTitle>
      </LayoutHeader>

      <LayoutContent>
        <Card className="bg-background">
          <CardContent className="mt-6">
            <FormSettings
              userId={session.user.id}
              name={session.user.name ?? ""}
              image={session.user.image ?? ""}
            />
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}
