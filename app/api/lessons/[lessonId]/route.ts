import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    if (!params.lessonId) {
      return new NextResponse("Lesson ID Missing", { status: 400 });
    }

    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
      },
    });

    if (!lesson) {
      return new NextResponse("Lesson not found", { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.log("[LESSON_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
