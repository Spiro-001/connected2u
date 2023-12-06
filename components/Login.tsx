"use client";

import React, { SyntheticEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux/hooks";
import { setToken } from "../app/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { TextField } from "@mui/material";

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
    <form
      className="flex flex-col border gap-y-2 px-4 py-5 rounded-md shadow-md"
      onSubmit={handleSubmit}
    >
      <label htmlFor="email">
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          name="email"
        />
      </label>
      <label htmlFor="password">
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          name="password"
          type="password"
        />
      </label>
      <button
        className="w-fit ml-auto bg-blue-400 rounded-md text-white font-bold py-0.5 px-3"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
