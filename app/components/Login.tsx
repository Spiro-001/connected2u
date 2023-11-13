"use client";

import React, { SyntheticEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setToken } from "../redux/features/authSlice";

const Login = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");
    const res = await fetch("/api/login", {
      credentials: "include",
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    dispatch(setToken(data.authentication.sessionToken));
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
