"use client";
import FileInput from "@/components/common/input/FileInput";
import Input from "@/components/common/input/Input";
import EditProfileValidation from "@/components/validation/EditProfileValidation";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/common/loading/Loading";

export default function EditProfile() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const id = searchParams.get("userid");
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initialize as true

  useEffect(() => {
    if (!session) {
      router.replace("/signin"); // Redirect to login page if user is not authenticated
      return;
    }

    if (id) {
      fetch(`/api/editprofile?${id}`)
        .then((response) => response.json())
        .then((userInfo) => {
          setName(userInfo.name);
          setIsLoading(false); // Set loading to false once user data is fetched
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false); // Set loading to false on error as well
        });
    }
  }, [session, id, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = EditProfileValidation({ name });
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (id) {
      formData.append("id", id);
    }

    if (files) {
      formData.append("image", files![0]);
    }
    const updateProfile = () => {
      toast.loading("Please wait while we update your profile");
      return new Promise((resolve, reject) => {
        if (id) {
          fetch(`api/editprofile`, {
            method: "PUT",
            body: formData,
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              toast.dismiss();

              resolve(data);
              // Redirect to /dashboard after successful update
              router.push("/dashboard");
            })
            .catch((error) => {
              toast.dismiss();
              toast.error(
                "Couldn't update your profile. Please try again letter."
              );
              reject(error);
            });
        }
      });
    };

    updateProfile()
      .then((data) => {})
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error("Error updating profile. Please try again later.");
      });
  };

  return (
    <div className="flex items-center justify-center flex-col max-w-4xl md:mx-10 mx-1 lg:mx-auto rounded-lg bg-slate-100  m-10 p-5 shadow-md dark:bg-gray-800">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1 className="mb-5 text-2xl font-bold">Edit Profile</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-10 w-full">
            <Input
              label="Name"
              id="name"
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              error={errors.name}
            />

            <FileInput onChange={(ev) => setFiles(ev.target.files)} />

            <div className="mt-10 flex items-center">
              <button className="flex items-center justify-center rounded bg-black py-2 px-4 font-bold text-white dark:border">
                Update Profile
              </button>
            </div>
          </form>
        </>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
