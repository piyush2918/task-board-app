import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromCookie } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromCookie();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const resolvedParams = await params;

    const task = await prisma.task.findUnique({
      where: {
        id: resolvedParams.id,
      },
    });

    if (!task || task.userId !== userId) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: resolvedParams.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromCookie();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;

    const task = await prisma.task.findUnique({
      where: {
        id: resolvedParams.id,
      },
    });

    if (!task || task.userId !== userId) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: {
        id: resolvedParams.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete task error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
