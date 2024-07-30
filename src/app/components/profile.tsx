"use client";
import { useEffect, useState } from "react";
import gallery from "../../../public/images/gallery.jpg";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { headers } from "next/headers";

interface UserI {
  _id: any;
  email: string;
  password: string;
  gender: string;
  imageUrl: string;
}

export default function ({ id }: any) {
  const [user, setUser] = useState<any>();
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${String(id)}`);
        if (data) {
          setUser(data.user);
        } else {
          console.log(`Error`);
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };
    fetchUser();
  }, []);

  const handleMessage = async () => {
    try {
      const { data } = await axios.get(`/api/chat/${id}`);
      console.log(data);
      router.push(`/chat/${id}`);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <h1 className="text-center mt-3 font-mono text-lg">User Profile</h1>
      <div className="flex flex-col items-center justify-center h-full mt-5">
        <div className="img">
          <img src={user?.imageUrl} width={250} height={300} alt="#" />
        </div>
        <div className="desc p-3">
          <div className="flex">
            <h1>Name: </h1>
            <p>&nbsp; {user?.name}</p>
          </div>
          <div className="flex">
            <h1>Email: </h1>
            <p>&nbsp; {user?.email}</p>
          </div>
          <div className="flex">
            <h1>Age: </h1>
            <p>&nbsp; {user?.age}</p>
          </div>
          <div className="flex">
            <h1>Gender: </h1>
            <p>&nbsp; {user?.gender}</p>
          </div>
          <div className="flex">
            <h1>Status: </h1>
            <p>&nbsp; {user?.status}</p>
          </div>
          <div className="flex">
            <h1>About: </h1>
            <p>&nbsp; {user?.description}</p>
          </div>
        </div>

        <button className="p-2 bg-gray-300" onClick={handleMessage}>
          Send message
        </button>
      </div>
    </>
  );
}
