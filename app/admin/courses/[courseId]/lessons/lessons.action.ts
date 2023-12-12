"use server";

import { ServerError, authenticatedAction } from "@/lib/action";
import { getTheMiddleRank } from "@/lib/getTheMiddleRank";
import { db } from "@/lib/prisma";
import { z } from "zod";

const SaveLessonMoveSchema = z.object({
  upItemRank: z.string().optional(),
  downItemRank: z.string().optional(),
  lessonId: z.string(),
});

export const saveLessonMove = authenticatedAction(
  SaveLessonMoveSchema,
  async (data, { userId }) => {
    const course = await db.course.findFirst({
      where: {
        lessons: {
          some: {
            id: data.lessonId,
          },
        },
        creatorId: userId,
      },
    });

    if (!course) {
      throw new ServerError("This course doesn't exist");
    }

    const lesson = await db.lesson.findFirst({
      where: {
        id: data.lessonId,
        courseId: course.id,
      },
    });

    if (!lesson) {
      throw new ServerError("This lesson doesn't exist");
    }

    const newRank = getTheMiddleRank(data.upItemRank, data.downItemRank);

    await db.lesson.update({
      where: {
        id: data.lessonId,
      },
      data: {
        rank: newRank,
      },
    });

    return newRank;
  }
);
