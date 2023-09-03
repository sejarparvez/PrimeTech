import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { search } = req.nextUrl;
    const queryParameters = new URLSearchParams(search);
    const id = queryParameters.get("id");

    if (id === null) {
      // Handle the case where id is not provided in the query parameters
      return new NextResponse("User ID is missing in query parameters", {
        status: 400, // Bad Request
      });
    }

    // Get the page and limit from query parameters or use default values
    const page = parseInt(queryParameters.get("page") || "1");
    const limit = parseInt(queryParameters.get("limit") || "10");

    // Calculate the offset to skip the appropriate number of posts
    const offset = (page - 1) * limit;

    const userInfo = await prisma.user.findUnique({
      where: { id }, // Ensure that id is not null
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        posts: {
          include: {
            author: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
          skip: offset, // Skip the appropriate number of posts
          take: limit, // Limit the number of posts per page
        },
        comments: true,
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
