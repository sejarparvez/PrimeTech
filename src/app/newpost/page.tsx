"use client";
import FileInput from "@/components/common/input/FileInput";
import PostInput from "@/components/common/input/PostInput";
import Content from "@/components/common/post/Content";
import NewPostCategories from "@/components/common/post/NewPostCategory";
import NewPostValidation from "@/components/validation/NewPostValidation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewPost() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [validationFailed, setValidationFailed] = useState(false);

  // Use useEffect to ensure that code only runs on the client side
  useEffect(() => {
    if (status === "loading") {
      // Loading state while session data is being fetched
      return;
    }

    if (!session) {
      // User is not logged in, show a message or redirect
      router.push("/login"); // Redirect to the login page or another appropriate page
    }
  }, [status, session, router]);

  async function createNewPost(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    const errors = NewPostValidation({
      title,
      categories,
      content,
      files,
    });

    if (Object.keys(errors).length > 0) {
      setErrors(errors as { [key: string]: string });
      setValidationFailed(true);
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("content", content);
    if (files) {
      data.append("file", files[0]);
    }
    data.append("categories", categories);

    const loadingToastId = toast.loading("Creating your post...", {
      autoClose: false,
      theme: "dark",
    });
    try {
      const response = await fetch("/api/post", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      toast.dismiss(loadingToastId);
      if (response.ok) {
        toast.success("Post is added successfully");
        router.push("/dashboard");
      } else {
        toast.error("Couldn't save your post. Please try again later");
      }
    } catch (error) {
      console.error(error);
      toast.error("Couldn't save your post. Please try again later");
    }
  }

  return (
    <div className="flex gap-10 items-center justify-center my-20  flex-col border mx-1 lg:mx-10 lg:p-10 bg-slate-100 rounded-lg dark:bg-gray-800">
      <div className="flex flex-col gap-2 justify-center items-center">
        <p className="font-bold text-3xl text-primary-200 dark:text-lightgray-100">
          Create New Post{" "}
        </p>
        <span className="flex h-1 w-40 bg-primary-200 dark:bg-lightgray-100"></span>
      </div>
      <form
        className="flex flex-col gap-10 w-full justify-center p-2 md:p-10 lg:p-20"
        onSubmit={createNewPost}
      >
        <PostInput
          label="Title"
          id="title"
          value={title}
          type="text"
          onChange={(ev) => setTitle(ev.target.value)}
          error={errors.title}
          maxLength={70}
        />

        <FileInput
          onChange={(ev) => setFiles(ev.target.files)}
          error={errors.files}
        />

        <NewPostCategories
          onChange={(ev) => setCategories(ev.target.value)}
          error={errors.categories}
        />
        <Content
          onChange={(newValue) => setContent(newValue)}
          error={errors.content}
          value={content}
        />

        <button
          className={`flex items-center justify-center rounded bg-primary-200 hover:bg-gray-900 py-2 px-4 font-bold text-white dark:bg-primary-200 border ${
            validationFailed ? "animate-shake" : ""
          }`}
        >
          Create Post
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
