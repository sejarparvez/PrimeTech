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
            id: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new NextResponse(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const token = await getToken({ req, secret });
  const authorId = token?.sub;
  const isAdmin = token?.email === process.env.NEXT_PUBLIC_ADMIN;

  if (!token || (!authorId && !isAdmin)) {
    // User is not authenticated or authorId is missing and not an admin
    return new NextResponse("User not logged in or authorId missing", {
      status: 401, // Unauthorized status
    });
  }

  try {
    const search = req.nextUrl;
    const commentId = search.searchParams.get("id");

    if (!commentId) {
      return new NextResponse("CommentId is required", {
        status: 400,
      });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return new NextResponse("Comment not found", {
        status: 404, // Not Found status
      });
    }

    if (comment.authorId === authorId || isAdmin) {
      // Check if the user is the author or an admin
      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });

      return new NextResponse(null, {
        status: 204, // No Content status
      });
    } else {
      return new NextResponse("You are not authorized to delete this comment", {
        status: 403, // Forbidden status
      });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new NextResponse("An error occurred", { status: 500 });
  }
}
