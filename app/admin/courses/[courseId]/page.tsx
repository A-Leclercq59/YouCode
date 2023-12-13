import Link from "next/link";
import { Ban, Menu, ShieldCheck } from "lucide-react";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import CoursePaginationButton from "@/features/pagination/PaginationButton";
import { getRequiredAuthSession } from "@/lib/auth";
import { getAdminCourse } from "./admin-course.query";

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: { courseId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page ?? 0);

  const session = await getRequiredAuthSession();

  const course = await getAdminCourse({
    courseId: params.courseId,
    userId: session.user.id,
    userPage: page,
  });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>
          <Link href="/admin/courses">Courses</Link>
        </LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex gap-4 lg:flex-row flex-col">
        <Card className="flex-[2]">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.users?.map((user) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Avatar className="rounded">
                        <AvatarFallback>{user.email?.[0]}</AvatarFallback>
                        {user.image && (
                          <AvatarImage
                            src={user.image}
                            alt={user.email ?? ""}
                          />
                        )}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography
                        as={Link}
                        variant="large"
                        href={`/admin/users/${user.id}`}
                      >
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {user.canceled ? "Canceled" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex flex-row-reverse">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="secondary">
                            <Menu size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <form className="cursor-pointer">
                              <button
                                formAction={async () => {
                                  "use server";

                                  const session =
                                    await getRequiredAuthSession();

                                  const courseId = params.courseId;
                                  const userId = user.id;

                                  const courseOnUser =
                                    await db.courseOnUser.findFirst({
                                      where: {
                                        userId,
                                        course: {
                                          id: courseId,
                                          creatorId: session?.user.id,
                                        },
                                      },
                                    });

                                  if (!courseOnUser) return;

                                  await db.courseOnUser.update({
                                    where: {
                                      id: courseOnUser.id,
                                    },
                                    data: {
                                      canceledAt: courseOnUser.canceledAt
                                        ? null
                                        : new Date(),
                                    },
                                  });

                                  revalidatePath(`/admin/courses/${courseId}`);
                                }}
                                className="flex items-center"
                              >
                                {user.canceled ? (
                                  <>
                                    <ShieldCheck className="mr-2 h-4 w-4" />{" "}
                                    <span>Activate</span>
                                  </>
                                ) : (
                                  <>
                                    <Ban className="mr-2 h-4 w-4" />
                                    <span>Cancel</span>
                                  </>
                                )}
                              </button>
                            </form>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <CoursePaginationButton
              baseUrl={`/admin/courses/${course.id}`}
              page={page}
              totalPage={course._count?.users ?? 0 / 5}
            />
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex-row space-y-0 items-center gap-4">
            <Avatar className="rounded">
              <AvatarFallback>{course.name?.[0]}</AvatarFallback>
              {course.image && (
                <AvatarImage src={course.image} alt={course.name ?? ""} />
              )}
            </Avatar>
            <CardTitle>{course.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <Typography>{course._count?.users} users</Typography>
            <Typography>{course._count?.lessons} lessons</Typography>
            <Link
              href={`/admin/courses/${course.id}/edit`}
              className={buttonVariants({ variant: "outline" })}
            >
              Edit
            </Link>
            <Link
              href={`/admin/courses/${course.id}/lessons`}
              className={buttonVariants({ variant: "outline" })}
            >
              Edit lessons
            </Link>
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}
