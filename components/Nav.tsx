"use client";

import { useRouter } from "next/navigation";
import React from "react";

const Nav = () => {
  const router = useRouter();
  return (
    <nav className="bg-red-50 w-full flex py-4 px-8">
      <button onClick={(e) => router.push("/home")}>Connected2U</button>
      <button onClick={(e) => router.push("/upload")} className="ml-auto">
        Upload
      </button>
    </nav>
  );
};

export default Nav;
