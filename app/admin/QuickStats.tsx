import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { getRequiredAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { BookCheck, Presentation, User2 } from "lucide-react";

export type QuickStatsProps = {};

export const QuickStats = async (props: QuickStatsProps) => {
  const session = await getRequiredAuthSession();

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const users = await db.user.count({
    where: {
      ownedCourses: {
        some: {
          course: {
            creatorId: session.user.id,
          },
        },
      },
    },
  });

  const lessons = await db.lesson.count({
    where: {
      course: {
        creatorId: session.user.id,
      },
    },
  });

  const courses = await db.course.count({
    where: {
      creatorId: session.user.id,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick stats</CardTitle>
      </CardHeader>
      <CardContent>
        <Typography className="">
          <User2 className="inline" size={16} /> {users} users
        </Typography>
        <Typography>
          <BookCheck className="inline" size={16} /> {lessons} lessons
        </Typography>
        <Typography>
          <Presentation className="inline" size={16} /> {courses} courses
        </Typography>
      </CardContent>
    </Card>
  );
};
