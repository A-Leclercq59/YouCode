import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRequiredAuthSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { AdminLessonItem } from "./AdminLessonItem";
import { getCourseLessons } from "./lessons.query";
import { SubmitButton } from "@/components/form/SubmitButton";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function CourseLessonsPage({
  params,
}: {
  params: {
    courseId: string;
  };
}) {
  const session = await getRequiredAuthSession();

  const course = await getCourseLessons({
    courseId: params.courseId,
    userId: session.user.id,
  });

  if (!course) {
    notFound();
  }

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Lessons · {course.name}</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4 lg:flex-row">
        <Card className="flex-[2]">
          <CardHeader>
            <CardTitle>Lessons</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {course.lessons.map((lesson) => (
              <AdminLessonItem key={lesson.id} lesson={lesson} />
            ))}
          </CardContent>
        </Card>
        <Link
          href={`/admin/courses/${params.courseId}/lessons/new`}
          className={buttonVariants({ variant: "secondary" })}
        >
          Create Lesson
        </Link>
      </LayoutContent>
    </Layout>
  );
}
