"use client";
import SigninInput from "@/components/common/input/SigninInput";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaFacebookF, FaGithub, FaTwitter } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginValidation from "../../components/validation/LoginValidation";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleEmailChange = (e: { target: { value: any } }) => {
    setData((prevData) => ({
      ...prevData,
      email: e.target.value,
    }));
  };
  const handlePasswordChange = (e: { target: { value: any } }) => {
    setData((prevData) => ({
      ...prevData,
      password: e.target.value,
    }));
  };

  const loginUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const errors = LoginValidation({
      email: data.email,
      password: data.password,
    });
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const loadingToastId = toast.loading("Logging in...", {
        autoClose: false,
        theme: "dark",
      });

      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      toast.dismiss(loadingToastId);

      if (response?.error) {
        toast.error("Sign-in failed. Please check your email and password.");
      } else {
        toast.success("Successful sign-in");

        router.push("/dashboard");
      }

      return response;
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
  };

  if (session) {
    return (
      <div>
        You are already logged in. Go to{" "}
        <Link href={"/dashboard"} className="font-bold">
          Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="grid w-11/12 grid-cols-1 justify-around rounded-2xl shadow-2xl  md:grid-cols-5">
        <div className="col-span-3 bg-slate-300 p-6 dark:bg-slate-700  md:rounded-l-2xl">
          <section className="my-8 flex flex-col items-center justify-center gap-4">
            <h1 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl">
              Log in to PrimeTech
            </h1>
            <span className="bg-primary-200 flex h-1 w-20 rounded-full"></span>
            <div className="my-3 flex gap-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary dark:border-white dark:text-white">
                <FaFacebookF />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary dark:border-white dark:text-white">
                <FaTwitter />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary dark:border-white dark:text-white">
                <FaGithub />
              </span>
            </div>
            <p className="dark:text-primary-200">or use your email account</p>
            <form
              className="my-6 flex w-full flex-col gap-5 md:w-2/3"
              onSubmit={loginUser}
            >
              <SigninInput
                label="Input Your Email"
                id="email"
                type="email"
                error={errors.email}
                onChange={handleEmailChange}
                value={data.email}
              />
              <SigninInput
                label="Input Your Password"
                id="password"
                type="password"
                error={errors.password}
                onChange={handlePasswordChange}
                value={data.password}
              />
              <Button>Log In</Button>
              <p className="text-center md:hidden">
                Don&apos;t have an account?
                <Link href={"/signup"} className="pl-2 text-xl font-bold">
                  Register
                </Link>
              </p>
            </form>
          </section>
        </div>
        <div className="col-span-2 hidden flex-col items-center justify-center gap-4  bg-slate-800 p-16 text-center text-white  md:flex md:rounded-r-2xl">
          <span className="text-lightgray-100 text-3xl font-bold">
            Hi, There!
          </span>
          <span className="bg-lightgray-100 flex h-1 w-20 rounded-full"></span>
          <span className="text-darkgray-100 my-4">
            New to PrimeTech? Let&#39;s create a free account to start your
            journey with us.
          </span>
          <Link href="/signup">
            <Button>Registration</Button>
          </Link>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
