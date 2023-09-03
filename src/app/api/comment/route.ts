import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest, res: NextResponse) {
  const token = await getToken({ req, secret });
  const authorId = token?.sub;
  if (!token || !authorId) {
    // User is not authenticated or authorId is missing
    return new NextResponse("User not logged in or authorId missing");
  }
  try {
    const { content, postId } = await req.json();

    console.log({ content, postId });

    if (!content || !postId) {
      return new NextResponse("Content and postId are required", {
        status: 400,
      });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
    });

    return new NextResponse(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { search } = req.nextUrl;
    const postId = search.slice(1);
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new NextResponse("An error occurred", { status: 500 });
  }
}
