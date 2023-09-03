import storage from "@/utils/firebaseConfig";
import { PrismaClient } from "@prisma/client";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return new NextResponse("User not logged in");
    }

    const data = await req.formData();

    const titleEntry = data.get("title");
    const cover = data.get("file");
    const categoriesEntry = data.get("categories");
    const contentEntry = data.get("content");

    if (!titleEntry || !cover || !categoriesEntry || !contentEntry) {
      return new NextResponse("Missing title, file, categories, or content", {
        status: 400,
      });
    }

    let title = "";
    if (typeof titleEntry === "string") {
      title = titleEntry;
    } else if (titleEntry instanceof File) {
      title = titleEntry.name;
    }

    let categories = "";
    if (typeof categoriesEntry === "string") {
      categories = categoriesEntry;
    } else if (categoriesEntry instanceof File) {
      categories = categoriesEntry.name;
    }

    let content = "";
    if (typeof contentEntry === "string") {
      content = contentEntry;
    } else if (contentEntry instanceof File) {
      content = contentEntry.name;
    }

    const coverBlob = cover as Blob;

    const buffer = Buffer.from(await coverBlob.arrayBuffer());
    const filename = Date.now() + coverBlob.name.replaceAll(" ", "_");

    try {
      // Upload file to Firebase storage
      const storageRef = ref(storage, "uploads/" + filename);
      await uploadBytes(storageRef, buffer);

      // Get download URL from Firebase storage
      const downloadURL = await getDownloadURL(storageRef);

      // Create a new post using Prisma
      const newPost = await prisma.post.create({
        data: {
          title,
          coverImage: downloadURL,
          category: categories,
          content,
          author: { connect: { id: token.sub } },
        },
      });

      return new NextResponse("Post created successfully", { status: 201 });
    } catch (error) {
      console.error("Error occurred while uploading the file: ", error);
      return new NextResponse("File upload failed", { status: 500 });
    }
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("An error occurred", { status: 500 });
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return new NextResponse("You are not logged in");
    }

    const body = await req.formData();

    const title = body.get("title");
    const content = body.get("content");
    const categories = body.get("categories");
    const userId = body.get("userId");
    const id = body.get("id");

    if (!id) {
      return new NextResponse("Invalid post ID", { status: 400 });
    }

    // Convert id to string
    const postId = id.toString();

    // Compare userId with token.sub
    if (userId !== token.sub) {
      return new NextResponse("You are not the author of this post");
    }

    const coverImageBlob = body.get("file") as Blob | null;

    let coverImageURL = null;
    if (coverImageBlob) {
      const buffer = Buffer.from(await coverImageBlob.arrayBuffer());
      const filename = Date.now() + coverImageBlob.name.replaceAll(" ", "_");

      // Upload file to Firebase storage
      const storageRef = ref(storage, "uploads/" + filename);
      await uploadBytes(storageRef, buffer);

      // Get download URL from Firebase storage
      coverImageURL = await getDownloadURL(storageRef);

      // Delete previous image from Firebase storage
      if (coverImageURL && postId) {
        const previousPost = await prisma.post.findUnique({
          where: { id: postId },
          select: { coverImage: true },
        });

        if (previousPost?.coverImage) {
          const previousImageRef = ref(storage, previousPost.coverImage); // Create a reference from URL
          await deleteObject(previousImageRef);
        }
      }
    }

    // Update the post using Prisma
    const updatedPostData: {
      title: string;
      content: string;
      category: string;
      coverImage?: string;
    } = {
      title: title as string,
      content: content as string,
      category: categories as string,
    };

    if (coverImageURL !== null) {
      updatedPostData.coverImage = coverImageURL;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updatedPostData,
    });

    return new NextResponse("Post updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("An error occurred", { status: 500 });
  }
}
