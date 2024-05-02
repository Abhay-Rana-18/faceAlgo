import { useRouter } from "next/navigation";
import Login from "../components/Login";
import { token } from "../cookies/token";

export default function () {
  // const router = useRouter();
  // if (token()) {
  //   router.push("/");
  // }
  return <Login />;
}
