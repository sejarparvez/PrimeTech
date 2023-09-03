"use client";
import FileInput from "@/components/common/input/FileInput";
import Input from "@/components/common/input/PostInput";
import Loading from "@/components/common/loading/Loading";
import Categories from "@/components/common/post/Categories";
import Content from "@/components/common/post/Content";
import EditPostValidation from "@/components/validation/EditPostValidation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PageProps {
  params: { slug: string; category: string };
}

function EditPost({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [validationFailed, setValidationFailed] = useState(false);

  useEffect(() => {
    fetch(`/api/${params.category}/${params.slug}`).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setId(postInfo.id);
        setUserId(postInfo.author.id);
        setContent(postInfo.content);
        setSelectedCategory(postInfo.category);
        setIsLoading(false);
      });
    });
  }, [params.slug, params.category]);

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  async function UpdatePost(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    const errors = EditPostValidation({
      title,
      categories: selectedCategory,
      content,
    });
    if (Object.keys(errors).length > 0) {
      setErrors(errors as { [key: string]: string });
      setValidationFailed(true);
      return;
    }
    const data = new FormData();
    data.set("title", title);
    data.set("content", content);
    data.set("categories", selectedCategory);
    data.set("userId", userId);
    if (id) {
      data.set("id", id.toString());
    }

    if (files?.[0]) {
      data.set("file", files?.[0]);
    }

    toast.loading("Please wait while we save your post to the database.");

    await fetch(`/api/post`, {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    toast.dismiss();
    router.push("/");
  }

  return (
    <div className="flex gap-10 items-center justify-center my-20  flex-col border mx-1 lg:mx-10 lg:p-10 bg-slate-100 rounded-lg dark:bg-gray-800">
      <form
        className="flex flex-col gap-10 w-full justify-center p-2 md:p-10 lg:p-20"
        onSubmit={UpdatePost}
      >
        <Input
          label="Title"
          id="title"
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          error={errors.title}
          maxLength={70}
        />

        <Categories
          selectedCategory={selectedCategory}
          onChange={(ev) => setSelectedCategory(ev.target.value)}
          error={errors.categories}
        />

        <FileInput onChange={(ev) => setFiles(ev.target.files)} />

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
          Update Post
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default EditPost;
