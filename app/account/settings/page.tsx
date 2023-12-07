import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { getRequiredAuthSession } from "@/lib/auth";
import FormSettings from "./FormSettings";

export default async function SettingsPage() {
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
