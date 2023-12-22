import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url);
    const queryParams = new URLSearchParams(url.search);
    const searchName = queryParams.get("search") || "";
    const lastUpdatedPost = await prisma.post.findMany({
      where: {
        category: "hotpost",
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
          },
        },
      },
      orderBy: searchName ? { updatedAt: "asc" } : { updatedAt: "desc" },
      take: 3,
    });

    if (lastUpdatedPost) {
      return new NextResponse(JSON.stringify(lastUpdatedPost), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new NextResponse("No  post found.", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }
  } catch (error) {
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
