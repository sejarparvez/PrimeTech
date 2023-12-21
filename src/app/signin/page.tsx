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

  const handleGitHubLogin = async () => {
    try {
      const loadingToastId = toast.loading("Logging in with GitHub...", {
        autoClose: false,
        theme: "dark",
      });

      const response = await signIn("github", {
        callbackUrl: `${window.location.origin}/dashboard`,
      });

      toast.dismiss(loadingToastId);

      if (response?.error) {
        toast.error("GitHub sign-in failed.");
      }

      return response;
    } catch (error) {
      console.error("GitHub sign-in error:", error);
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
      <div className="grid md:grid-cols-5 grid-cols-1 rounded-2xl justify-around shadow-2xl  w-11/12">
        <div className="col-span-3 p-6 bg-primary-100 dark:bg-slate-400 border dark:border-none  md:rounded-l-2xl">
          <section className="flex gap-4 items-center justify-center flex-col my-8">
            <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl text-center">
              Log in to PrimeTech
            </h1>
            <span className="h-1 w-20 rounded-full bg-primary-200 flex"></span>
            <div className="flex gap-6 my-3">
              <span className="flex items-center text-primary-200 dark:border-primary-200 justify-center h-10 w-10 rounded-full border">
                <FaFacebookF />
              </span>
              <span className="flex items-center text-primary-200 dark:border-primary-200 justify-center h-10 w-10 rounded-full border">
                <FaTwitter />
              </span>
              <span
                className="flex items-center text-primary-200 dark:border-primary-200 justify-center h-10 w-10 rounded-full border"
                onClick={handleGitHubLogin}
              >
                <FaGithub />
              </span>
            </div>
            <p className="dark:text-primary-200">or use your email account</p>
            <form
              className="flex flex-col gap-5 my-6 w-full md:w-2/3"
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
              <p className="md:hidden text-center">
                Don&apos;t have an account?
                <Link href={"/signup"} className="text-xl font-bold pl-2">
                  Register
                </Link>
              </p>
            </form>
          </section>
        </div>
        <div className="hidden md:flex bg-primary-200 dark:bg-gray-800 col-span-2  md:rounded-r-2xl gap-4 p-16 items-center justify-center text-center flex-col">
          <span className="font-bold text-3xl text-lightgray-100">
            Hi, There!
          </span>
          <span className="h-1 w-20 rounded-full bg-lightgray-100 flex"></span>
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
