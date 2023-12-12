import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    if (!params.courseId) {
      return new NextResponse("Course ID Missing", { status: 400 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
