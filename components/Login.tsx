"use client";

import React, { SyntheticEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux/hooks";
import { setToken } from "../app/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");
    signIn("credentials", {
      username: email,
      password: password,
    });
    // router.push("/home");
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label htmlFor="email">
        <input placeholder="email" name="email" />
      </label>
      <label htmlFor="password">
        <input placeholder="password" type="text" name="password" />
      </label>
      <button className="w-fit" type="submit">
        Login
      </button>
    </form>
  );
};

export default Login;
