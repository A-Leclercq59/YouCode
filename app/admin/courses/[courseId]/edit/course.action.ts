"use server";

import { z } from "zod";

import { authenticatedAction } from "@/lib/action";
import { db } from "@/lib/prisma";
import { CourseFormSchema } from "./course.schema";

const CourseActionEditProps = z.object({
  courseId: z.string(),
  data: CourseFormSchema,
});

export const courseActionEdit = authenticatedAction(
  CourseActionEditProps,
  async (props, { userId }) => {
    await db.course.update({
      where: {
        id: props.courseId,
        creatorId: userId,
      },
      data: props.data,
    });

    return "Course updated successfully";
  }
);
