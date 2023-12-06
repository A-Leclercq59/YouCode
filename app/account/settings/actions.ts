"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { formSchemaUpdateUser } from "@/lib/schema";

export const updateUser = async (
  values: z.infer<typeof formSchemaUpdateUser>,
  userId: string
) => {
  try {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name: values.name,
        image: values.image,
      },
    });

    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    console.log(error);

    return { success: false };
  }
};
