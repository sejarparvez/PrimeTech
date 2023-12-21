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
        "Sign-up failed. Please check your email and password. email may already exits"
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
      <div className="flex items-center justify-center w-screen h-screen">
        <p>You are already logged in.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center  ">
      <div className="grid md:grid-cols-5 grid-cols-1 rounded-2xl justify-around shadow-2xl  w-11/12">
        <div className="col-span-3 p-4 bg-primary-100 dark:bg-slate-400 border dark:border-none  md:rounded-l-2xl">
          <section className="flex gap-4 items-center justify-center flex-col my-8">
            <h1 className="font-bold underline text-primary-200 text-3xl text-center">
              Create New Account
            </h1>
            <span className="h-1 w-20 rounded-full bg-primary-200 flex"></span>
            <form
              className="flex flex-col gap-5 my-6 w-full md:w-2/3 "
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
          <div className="flex items-center dark:text-slate-50 justify-center mt-10 gap-4">
            <Link href={"/policy"}>Privacy Policy</Link>
            <SiPolkadot />
            <Link href={"/terms"}>Terms & Condtions</Link>
          </div>
        </div>
        <div className="hidden md:flex bg-primary-200 dark:bg-gray-800 col-span-2  md:rounded-r-2xl gap-4 p-16 items-center justify-center text-center flex-col">
          <span className="font-bold text-3xl text-lightgray-100">
            Hi, There!
          </span>
          <span className="h-1 w-20 rounded-full bg-lightgray-100 flex"></span>
          <span className="text-darkgray-100 my-4">
            Already have an account?
          </span>
          <Link href="/signin">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
