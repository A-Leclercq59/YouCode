"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { authenticatedAction } from "@/lib/action";

import { db } from "@/lib/prisma";
import { formSchemaUpdateUser } from "./updateUser.schema";

const UpdateUserProps = z.object({
  userId: z.string(),
  data: formSchemaUpdateUser,
});

export const updateUser = authenticatedAction(
  UpdateUserProps,
  async (props, { userId }) => {
    try {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name: props.data.name,
          image: props.data.image,
        },
      });

      revalidatePath("/account");

      return { success: true };
    } catch (error) {
      console.log(error);

      return { success: false };
    }
  }
);
