"use client";
import Image from "next/image";
import Dashboard from "./components/Dashboard";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      <div className="nav flex w-[100vw] bg-yellow-200 p-2">
        <h1 className="text-center font-semibold">Face Algo</h1>
        {localStorage.getItem("token") ? (
          <div className="register flex gap-1 ml-auto">
            <Button variant="outlined" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="register flex gap-1 ml-auto">
            <Button
              variant="outlined"
              onClick={() => {
                router.push("/login");
              }}
            >
              login
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                router.push("/signup");
              }}
            >
              signup
            </Button>
          </div>
        )}
      </div>
      <Dashboard />
    </>
  );
}
