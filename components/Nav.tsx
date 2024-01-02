"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import UploadIcon from "@mui/icons-material/Upload";
import LogoutIcon from "@mui/icons-material/Logout";
import CameraIcon from "@mui/icons-material/Camera";
import React from "react";

const Nav = () => {
  const router = useRouter();
  return (
    <nav className="bg-red-50 w-full flex py-4 px-8 gap-x-6">
      <button
        onClick={(e) => router.push("/home")}
        className="mr-auto flex items-center font-bold"
      >
        <CameraIcon />
        <p className="pl-2">CONNECTED2U</p>
      </button>
      <button
        onClick={(e) => router.push("/upload")}
        className="font-bold flex items-center"
      >
        <UploadIcon />
        <p className="pl-2">Upload Photos</p>
      </button>
      <button
        onClick={(e) => signOut()}
        className="font-bold flex items-center"
      >
        <LogoutIcon />
        <p className="pl-2">Logout</p>
      </button>
    </nav>
  );
};

export default Nav;
