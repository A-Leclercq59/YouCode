import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { MarkdownProse } from "@/features/mdx/MardownProse";
import { CourseType } from "./course.query";
import { LessonItem } from "./lessons/LessonItem";
import { SubmitButton } from "@/components/form/SubmitButton";
import { getRequiredAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CourseProps = {
  course: CourseType;
  userId?: string;
};

export const Course = ({ course, userId }: CourseProps) => {
  const isLogin = Boolean(userId);
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
        <Card className="flex-[2] hover:bg-accent w-full">
          <CardHeader className="flex flex-row gap-3 space-y-0">
            <Avatar className="h-14 w-14 rounded">
              <AvatarFallback>{course.name[0]}</AvatarFallback>
              {course.image ? <AvatarImage src={course.image} /> : null}
            </Avatar>
            <div className="flex flex-col gap-3">
              <CardTitle>{course.name}</CardTitle>
              <div className="flex flex-row gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{course.name[0]}</AvatarFallback>
                  {course.creator.image ? (
                    <AvatarImage src={course.creator.image} />
                  ) : null}
                </Avatar>
                <Typography variant="large" className=" text-muted-foreground">
                  {course.creator.name}
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MarkdownProse markdown={course.presentation} />
          </CardContent>
        </Card>
        <div className="flex flex-1 max-lg:flex-row-reverse max-lg:justify-between max-[428px]:flex-col flex-col gap-4 w-full">
          {course.isCanceled ? <p>You can&apos;t join this course.</p> : null}
          {!course.isCanceled && !course.isEnrolled && isLogin ? (
            <Card className="h-full">
              <CardHeader className="items-center">
                <CardTitle>
                  <form>
                    <SubmitButton
                      formAction={async () => {
                        "use server";

                        const session = await getRequiredAuthSession();

                        const courseOnUser = await db.courseOnUser.create({
                          data: {
                            userId: session.user.id,
                            courseId: course.id,
                          },
                          select: {
                            course: {
                              select: {
                                id: true,
                                lessons: {
                                  orderBy: {
                                    rank: "asc",
                                  },
                                  take: 1,
                                  select: {
                                    id: true,
                                  },
                                },
                              },
                            },
                          },
                        });

                        const lesson = courseOnUser.course.lessons[0];

                        revalidatePath(`/courses/${course.id}`);

                        if (!lesson) {
                          return;
                        }

                        redirect(`/courses/${course.id}/lessons/${lesson.id}`);
                      }}
                    >
                      Join this course
                    </SubmitButton>
                  </form>
                </CardTitle>
              </CardHeader>
            </Card>
          ) : null}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Lessons</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {course.lessons.map((lesson) => (
                <LessonItem lesson={lesson} key={lesson.id} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
