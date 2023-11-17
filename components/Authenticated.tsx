"use client";

import { useGetSessionTokenClient } from "@/utils/useGetSessionTokenClient";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux/hooks";
import { setToken } from "../app/redux/features/authSlice";

type AuthenticationStateType = {
  loading: boolean;
  authenticated: boolean | null;
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
    const res = await fetch("/api/validate", {
      method: "POST",
      body: JSON.stringify({
        id: "b3e4b777-58bb-45c9-a383-e0f96ff26751",
        sessionToken,
      }),
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
      dispatch(setToken(data.validate.authentication.sessionToken));
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
