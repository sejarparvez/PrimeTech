"use client";
import SigninInput from "@/components/common/input/SigninInput";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiPolkadot } from "react-icons/si";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../components/common/input/Input";
import RegistrationValidation from "../../components/validation/RegistrationValidation";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleEmailChange = (e: { target: { value: any } }) => {
    setData((prevData) => ({
      ...prevData,
      email: e.target.value,
    }));
  };

  const handleNameChange = (e: { target: { value: any } }) => {
    setData((prevData) => ({
      ...prevData,
      name: e.target.value,
    }));
  };
  const handlePasswordChange = (e: { target: { value: any } }) => {
    setData((prevData) => ({
      ...prevData,
      password: e.target.value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const errors = RegistrationValidation({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    const loadingToastId = toast.loading("Please wait a momment...", {
      autoClose: false,
      theme: "dark",
    });
    const response = await fetch("/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    toast.dismiss(loadingToastId);
    if (response.status !== 200) {
      toast.error(
        "Sign-up failed. Please check your email and password. email may already exits",
      );
    } else {
      toast.success("Account created successfully");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    }
  };
  if (session) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>You are already logged in.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center  ">
      <div className="grid w-11/12 grid-cols-1 justify-around rounded-2xl shadow-2xl  md:grid-cols-5">
        <div className=" col-span-3 bg-slate-300 p-4  dark:bg-slate-700  md:rounded-l-2xl">
          <section className="my-8 flex flex-col items-center justify-center gap-4">
            <h1 className=" text-center text-3xl font-bold underline">
              Create New Account
            </h1>
            <span className=" flex h-1 w-20 rounded-full"></span>
            <form
              className="my-6 flex w-full flex-col gap-5 md:w-2/3 "
              onSubmit={handleSubmit}
            >
              <SigninInput
                label="Name"
                id="name"
                error={errors.name}
                type="text"
                onChange={handleNameChange}
                value={data.name}
              />
              <SigninInput
                label="Email"
                id="email"
                error={errors.email}
                type="email"
                onChange={handleEmailChange}
                value={data.email}
              />
              <Input
                label="Password"
                id="password"
                error={errors.password}
                type="password"
                onChange={handlePasswordChange}
                value={data.password}
              />
              <Button>Registration</Button>
            </form>
          </section>
          <p className="md:hidden">
            Already have an account?{" "}
            <Link href={"/signin"} className="text-xl font-bold">
              Login
            </Link>
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 dark:text-slate-50">
            <Link href={"/policy"}>Privacy Policy</Link>
            <SiPolkadot />
            <Link href={"/terms"}>Terms & Condtions</Link>
          </div>
        </div>
        <div className=" col-span-2 hidden flex-col items-center justify-center  gap-4 bg-slate-800 p-16 text-center text-white md:flex md:rounded-r-2xl">
          <span className="text-lightgray-100 text-3xl font-bold">
            Hi, There!
          </span>
          <span className="bg-lightgray-100 flex h-1 w-20 rounded-full"></span>
          <span className="text-darkgray-100 my-4">
            Already have an account?
          </span>
          <Link href="/signin">
            <Button className="px-10">Log In</Button>
          </Link>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
