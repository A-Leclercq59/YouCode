import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getCourses = async (userId?: string) => {
  return await db.course.findMany({
    where: userId
      ? {
          users: {
            some: {
              userId,
            },
          },
        }
      : undefined,
    select: {
      name: true,
      image: true,
      presentation: true,
      id: true,
      creator: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  });
};

// Get the type of getCourses
export type CoursesCard = Prisma.PromiseReturnType<typeof getCourses>[number];