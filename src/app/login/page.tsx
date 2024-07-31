import { useRouter } from "next/navigation";
import Login from "../components/Login";
import { token } from "../cookies/token";

export default function () {
  return <Login />;
}
