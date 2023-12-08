"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { authenticatedAction } from "@/lib/action";

import { db } from "@/lib/prisma";
import { formSchemaUpdateUser } from "./updateUser.schema";

export const updateUser = authenticatedAction(
  formSchemaUpdateUser,
  async (props, { userId }) => {
    try {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name: props.name,
          image: props.image,
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
