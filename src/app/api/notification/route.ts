import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return new NextResponse("User not logged in");
    }
    // Fetch notifications from your database using Prisma or your chosen database library.
    const notifications = await prisma.notification.findMany({
      where: {
        receiverId: token.sub,
      },
    });

    // Return the notifications in the response.
    return new NextResponse(JSON.stringify(notifications), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle any errors that occur during the database query or processing.
    console.error("Error fetching notifications:", error);

    // Return an error response if needed.
    return new NextResponse(
      JSON.stringify({
        error: "An error occurred while fetching notifications.",
      }),
      {
        status: 500, // HTTP 500 Internal Server Error
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
