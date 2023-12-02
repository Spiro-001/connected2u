"use client";

import { useGetSessionTokenClient } from "@/utils/useGetSessionTokenClient";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux/hooks";
import { setToken } from "../app/redux/features/authSlice";
import { getSession } from "next-auth/react";
import { useCookies } from "next-client-cookies";
import { cookies } from "next/headers";

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
  const sessionToken = useGetSessionTokenClient();
  const pathName = usePathname();

  const isValidSessionToken = async () => {
    const session = (await getSession()) as SessionType;
    console.log(session);
    const user = session?.user ?? { id: null, sessionToken: "" };
    const res = await fetch("/api/validate", {
      method: "POST",
      body: JSON.stringify({
        id: user.id,
        sessionToken: user.sessionToken,
      }),
    });
    cookies().set({
      name: "CONNECTED2U_AUTH_TOKEN",
      value: user.sessionToken,
      maxAge: 24 * 60 * 60,
    });
    if (!res.ok) {
      dispatch(setToken(null));
      setAuthentication({
        loading: false,
        authenticated: false,
      });
    }
    const data = await res.json();
    console.log(data);
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

  return <body className="flex flex-col items-center gap-y-4">{children}</body>;
};

export default Authenticated;
