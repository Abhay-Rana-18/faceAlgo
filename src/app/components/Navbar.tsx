"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Function to update the token state from localStorage
  const updateToken = () => {
    const tokenFromLocalStorage = localStorage.getItem("token");
    setToken(tokenFromLocalStorage);
  };

  useEffect(() => {
    // Initialize token state
    updateToken();

    // Add event listener to update state on storage change
    window.addEventListener("storage", updateToken);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("storage", updateToken);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null); // Update token state
    router.push("/login");
  };

  return (
    <div className="nav flex w-[100vw] bg-green-50/80 p-2 !sticky top-0">
      <h1
        className="text-center font-semibold ml-2"
        onClick={() => {
          router.push("/");
        }}
      >
        Face Algo
      </h1>
      {token ? (
        <div className="register flex gap-1 ml-auto mx-4">
          <Button
            variant="contained"
            onClick={() => {
              router.push("/chat");
            }}
            className="bg-blue-700/80 !text-xs sm:!text-sm md:!text-md lg:!text-[1rem]"
          >
            CHATS
          </Button>
          <Button
            variant="outlined"
            onClick={logout}
            className="!text-xs sm:!text-sm md:!text-md lg:!text-[1rem]"
          >
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
  );
};

export default Navbar;
