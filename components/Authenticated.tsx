"use client";

import { useGetSessionTokenClient } from "@/utils/useGetSessionTokenClient";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux/hooks";
import { setToken } from "../app/redux/features/authSlice";
import { getSession } from "next-auth/react";
import { useCookies } from "next-client-cookies";
import Login from "./Login";

type AuthenticationStateType = {
  loading: boolean;
  authenticated: boolean | null;
};

type SessionType = {
  user: {
    name: string;
    email: string;
    id: string;
    sessionToken: string;
  } | null;
  expires: string | null;
};

const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const [authentication, setAuthentication] = useState<AuthenticationStateType>(
    {
      loading: true,
      authenticated: null,
    }
  );
  const auth = useAppSelector((state) => state.auth.sessionToken);
  const router = useRouter();
  const dispatch = useAppDispatch();
  // const sessionToken = useGetSessionTokenClient();
  const pathName = usePathname();
  const cookies = useCookies();

  const isValidSessionToken = async () => {
    const session = (await getSession()) as SessionType;
    const user = session?.user ?? { id: null, sessionToken: "" };
    const res = await fetch("/api/validate", {
      method: "POST",
      body: JSON.stringify({
        id: user.id,
        sessionToken: user.sessionToken,
      }),
    });
    // FIX COOKIES NEED TO SET FOR AUTH FOR POST
    cookies.set("CONNECTED2U_AUTH_TOKEN", user.sessionToken, {
      expires: 30,
    });
    if (!res.ok) {
      dispatch(setToken(null));
      setAuthentication({
        loading: false,
        authenticated: false,
      });
    }
    const data = await res.json();
    if (!data.validate) {
      // Validation failed need new sessionToken
      dispatch(setToken(null));
      setAuthentication({
        loading: false,
        authenticated: false,
      });
      router.push("/");
    } else {
      dispatch(
        setToken({
          sessionToken: data.validate.authentication.sessionToken,
          id: data.validate.id,
        })
      );
      setAuthentication({
        loading: false,
        authenticated: true,
      });
      if (pathName === "/") {
        router.push("/home");
      }
    }
  };

  useEffect(() => {
    isValidSessionToken();
  }, []);

  return (
    <body className="flex flex-col items-center gap-y-4 h-screen">
      {!authentication.loading && authentication.authenticated === null && (
        <h1>Loading</h1>
      )}
      {!authentication.loading && authentication.authenticated && children}
      {!authentication.loading && !authentication.authenticated && (
        <main className="flex items-center justify-center h-full">
          <Login />
        </main>
      )}
    </body>
  );
};

export default Authenticated;
