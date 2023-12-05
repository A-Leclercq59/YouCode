import { db } from "@/lib/prisma";

export const getCourseLessons = async ({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) => {
  return await db.course.findFirst({
    where: {
      id: courseId,
      creatorId: userId,
    },
    select: {
      id: true,
      name: true,
      lessons: true,
    },
  });
};
