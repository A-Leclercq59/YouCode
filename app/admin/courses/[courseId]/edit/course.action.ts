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
    const course = await db.course.update({
      where: {
        id: props.courseId,
        creatorId: userId,
      },
      data: props.data,
    });

    return { message: "Course updated successfully", course };
  }
);

export const courseActionCreate = authenticatedAction(
  CourseFormSchema,
  async (props, { userId }) => {
    const course = await db.course.create({
      data: {
        ...props,
        creatorId: userId,
      },
    });

    return {
      message: "Course created successfully",
      course,
    };
  }
);
