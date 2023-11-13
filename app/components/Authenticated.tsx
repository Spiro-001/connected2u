"use client";

import { useGetSessionTokenClient } from "@/utils/useGetSessionTokenClient";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setToken } from "../redux/features/authSlice";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
      router.push("/home");
    }
  };

  useEffect(() => {
    isValidSessionToken();
  }, []);

  return <body className={inter.className}>{children}</body>;
};

export default Authenticated;
