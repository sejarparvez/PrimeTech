import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url);
    const queryParams = new URLSearchParams(url.search);

    const page = queryParams.get("page")
      ? parseInt(queryParams.get("page")!, 10)
      : 1;
    const pageSize = queryParams.get("pageSize")
      ? parseInt(queryParams.get("pageSize")!, 10)
      : 10;

    const skipCount = (page - 1) * pageSize;

    const allPosts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        coverImage: true,
        category: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: skipCount,
      take: pageSize,
    });

    if (allPosts.length > 0) {
      return new NextResponse(JSON.stringify(allPosts), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new NextResponse("No posts found.", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
