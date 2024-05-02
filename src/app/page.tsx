import Image from "next/image";
import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <>
      <h1 className="w-[100vw] text-center bg-yellow-200 p-2 font-semibold">Face Algo</h1>
      <Dashboard />
    </>
  );
}
