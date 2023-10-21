import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { search } = req.nextUrl;
    const queryParameters = new URLSearchParams(search);
    const category = queryParameters.get("category");
    const page = parseInt(queryParameters.get("page") || "1"); // Default to page 1
    const limit = parseInt(queryParameters.get("limit") || "10"); // Default to 10 posts per page

    const skip = (page - 1) * limit;

    const userInfo = await prisma.post.findMany({
      where: {
        category: {
          equals: category || undefined,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            image: true,
            name: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!userInfo) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(userInfo), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse("An error occurred", { status: 500 });
  }
}
