import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Authenticate user and retrieve token
    const token = await getToken({ req, secret });
    const id = token?.sub;

    if (!token) {
      // User is not authenticated
      return new NextResponse("User not logged in");
    }

    // Retrieve pagination parameters from the request query

    const userInfo = await prisma.user.findUnique({
      where: { id },

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
        },
        comments: true,
      },
    });

    if (!userInfo) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Prepare response data
    const responseData = {
      user: userInfo,
    };
    return new NextResponse(JSON.stringify(responseData), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse("An error occurred", { status: 500 });
  }
}
