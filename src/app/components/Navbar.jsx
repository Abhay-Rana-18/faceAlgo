"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [token1, setToken1] = useState("");
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken1(t);
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <>
      <div className="nav flex w-[100vw] bg-green-50/80 p-2 !sticky top-0">
        <h1 className="text-center font-semibold ml-2" onClick={() => {router.push("/")}}>Face Algo</h1>
        {token1 ? (
          <div className="register flex gap-1 ml-auto mx-4">
            <Button variant="contained" onClick={() => {router.push("/chat")}} className="bg-blue-700/80 !text-xs sm:!text-sm md:!text-md lg:!text-[1rem]">
              CHATS
            </Button>
            <Button variant="outlined" onClick={logout} className="!text-xs sm:!text-sm md:!text-md lg:!text-[1rem]">
              Logout
            </Button>
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
    </>
  );
};

export default Navbar;
