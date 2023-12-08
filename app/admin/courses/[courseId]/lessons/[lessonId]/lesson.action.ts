"use server";

import { authenticatedAction } from "@/lib/action";
import { db } from "@/lib/prisma";
import { z } from "zod";
import { LessonDetailSchema } from "./form/lesson.schema";

const LessonActionEditDetailsSchema = z.object({
  lessonId: z.string(),
  data: LessonDetailSchema,
});

const LessonActionCreateSchema = z.object({
  courseId: z.string(),
  data: LessonDetailSchema,
});

export const lessonActionEditDetails = authenticatedAction(
  LessonActionEditDetailsSchema,
  async (props, { userId }) => {
    const lesson = await db.lesson.update({
      where: {
        id: props.lessonId,
        course: {
          creatorId: userId,
        },
      },
      data: props.data,
    });

    return {
      message: "Lesson updated successfully",
      lesson,
    };
  }
);

export const lessonActionCreate = authenticatedAction(
  LessonActionCreateSchema,
  async (props, { userId }) => {
    // Authorize the user
    await db.course.findFirstOrThrow({
      where: {
        creatorId: userId,
        id: props.courseId,
      },
    });

    const lesson = await db.lesson.create({
      data: {
        name: props.data.name,
        rank: "aaaaa",
        state: props.data.state,
        courseId: props.courseId,
        content: "## Default content",
      },
    });

    return {
      message: "Lesson created successfully",
      lesson,
    };
  }
);
