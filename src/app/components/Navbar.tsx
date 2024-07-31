"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import UserContext from "../Context/user/userContext";
import MenuIntroduction from "./Avatar";

const Navbar = () => {
  const {isLoggedIn, userLogout, user} = useContext<any>(UserContext);
  const router = useRouter();

  const logout = () => {
    userLogout();
    localStorage.removeItem("token");
    router.push("/login");
  };


  return (
    <div className="nav flex w-[100vw] bg-green-50/80 p-2 !fixed top-0 h-[3rem]">
      <h1
        className="text-center font-semibold ml-2"
        onClick={() => {
          router.push("/");
        }}
      >
        Face Algo
      </h1>
      {isLoggedIn ? (
        <div className="register flex gap-1 ml-auto mx-4">
          {/* <Button
            variant="contained"
            onClick={() => {
              router.push("/chat");
            }}
            className="bg-blue-700/80 !text-xs sm:!text-sm md:!text-md lg:!text-[1rem]"
          >
            CHATS
          </Button> */}
          <MenuIntroduction />
        </div>
      ) : (
        <div className="register flex gap-1 ml-auto">
          <Button
            variant="outlined"
            className="!text-xs sm:!text-sm md:!text-md lg:!text-[1rem]"
            onClick={() => {
              router.push("/login");
            }}
          >
            login
          </Button>
          <Button
            variant="outlined"
            className="!text-xs sm:!text-sm md:!text-md lg:!text-[1rem]"
            onClick={() => {
              router.push("/signup");
            }}
          >
            signup
          </Button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
