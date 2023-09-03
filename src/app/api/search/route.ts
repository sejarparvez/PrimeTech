import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { search } = req.nextUrl;
    const queryParameters = new URLSearchParams(search);
    const query = queryParameters.get("query");

    if (!query || query.length < 4) {
      // Handle the case where the query parameter is missing or less than 4 characters
      return new NextResponse(
        "Query parameter must be at least 4 characters long",
        {
          status: 400, // Bad Request
        }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          // Define your search criteria here, e.g., searching in post title
          { title: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        title: true,
        category: true,
        id: true,
      },
    });

    // Return the search results as JSON
    return new NextResponse(JSON.stringify({ posts }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling search request:", error);
    // Handle errors gracefully and return an error response if needed
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after the request
  }
}
