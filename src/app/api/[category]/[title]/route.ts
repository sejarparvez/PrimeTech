import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

function decodeFromUrl(encodedStr: string) {
  return decodeURIComponent(encodedStr.replace(/_/g, " "));
}

export async function GET(req: NextRequest, res: NextResponse) {
  const { pathname } = req.nextUrl;
  const parts = pathname.split("/");
  const category = parts[2];
  const encodedTitle = parts[3];
  const title = decodeFromUrl(encodedTitle);

  try {
    const postData = await prisma.post.findFirst({
      where: {
        category: category,
        title: title,
      },
      select: {
        id: true,
        title: true,
        coverImage: true,
        category: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            email: true,
            image: true,
            id: true,
          },
        },
      },
    });

    if (postData) {
      return new NextResponse(JSON.stringify(postData));
    } else {
      return new NextResponse("Post not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    // Step 1: Authenticate the user
    const token = await getToken({ req, secret });
    const userId = token?.sub;

    if (!token || !userId) {
      // User is not authenticated
      return new NextResponse("User not authenticated", { status: 401 });
    }

    const { search } = await req.nextUrl;
    const postId = search.slice(1);

    // Step 2: Fetch the post details
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        author: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    const authorId = post.author.id;

    // Step 3: Check authorization
    if (userId !== authorId) {
      return new NextResponse(
        "Unauthorized: You can only delete your own posts",
        { status: 401 }
      );
    }

    // Step 4: Delete associated comments first
    await prisma.comment.deleteMany({
      where: {
        postId: postId,
      },
    });

    // Step 5: Delete the post
    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    if (deletedPost) {
      return new NextResponse("Post deleted successfully");
    } else {
      return new NextResponse("Post not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
