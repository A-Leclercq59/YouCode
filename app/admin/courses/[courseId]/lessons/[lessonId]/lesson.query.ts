import { db } from "@/lib/prisma";

export const getAdminLesson = async (lessonId: string, userId: string) => {
  return await db.lesson.findUnique({
    where: {
      id: lessonId,
      course: {
        creatorId: userId,
      },
    },
    select: {
      content: true,
      id: true,
      courseId: true,
      name: true,
      state: true,
    },
  });
};
