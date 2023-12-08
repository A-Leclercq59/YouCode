import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { getRequiredAuthSession } from "@/lib/auth";
import { LessonDetail } from "../[lessonId]/form/LessonDetailsForm";

export default async function LessonPage({
  params,
}: {
  params: {
    courseId: string;
  };
}) {
  await getRequiredAuthSession();

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Create course</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <Card className="flex-[2]">
          <CardContent className="mt-6">
            <LessonDetail courseId={params.courseId} />
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}
