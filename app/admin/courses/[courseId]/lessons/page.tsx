import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { getRequiredAuthSession } from "@/lib/auth";
import Link from "next/link";
import CoursePaginationButton from "@/features/pagination/PaginationButton";
import { buttonVariants } from "@/components/ui/button";
import { getCourseLessons } from "./lessons.query";
import { notFound } from "next/navigation";
import LessonItem from "./LessonItem";

export default async function CourseLessonsPage({
  params,
}: {
  params: { courseId: string };
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
      <LayoutContent className="flex gap-4 lg:flex-row flex-col">
        <Card className="flex-[2]">
          <CardHeader>
            <CardTitle>Lessons</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {course.lessons.map((lesson) => (
              <LessonItem key={lesson.id} lesson={lesson} />
            ))}
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}
