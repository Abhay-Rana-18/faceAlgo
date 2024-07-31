"use client";
import { useContext, useEffect, useState } from "react";
import gallery from "../../../public/images/gallery.jpg";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { headers } from "next/headers";
import Loader from "./Loader";
import UserContext from "../Context/user/userContext";

interface UserI {
  _id: any;
  email: string;
  password: string;
  gender: string;
  imageUrl: string;
}

export default function ({ id }: any) {
  const { getUser } = useContext<any>(UserContext);
  const [user1, setUser1] = useState<any>();
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const d = await getUser();
        if (d?.success) {
          setUser(d.user);
        }
        const { data } = await axios.get(`/api/users/${String(id)}`);
        if (data) {
          setUser1(data.user);
        } else {
          console.log(`Error`);
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleMessage = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/chat/${id}`);
      console.log(data);
      router.push(`/chat/${id}`);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }
  return (
    <>
      {/* <h1 className="text-center mt-3 font-mono text-lg">User Profile</h1> */}
      <div className="flex flex-col !items-center justify-center h-[90vh] mt-[3.5rem]">
        <div className="flex">
          <img
            src={user1?.imageUrl}
            width={300}
            height={400}
            alt="#"
            className="object-cover"
          />
        </div>
        <div className="desc p-3">
          <div className="flex">
            <h1>Name: </h1>
            <p>&nbsp; {user1?.name}</p>
          </div>
          <div className="flex">
            <h1>Email: </h1>
            <p>&nbsp; {user1?.email}</p>
          </div>
          <div className="flex">
            <h1>Age: </h1>
            <p>&nbsp; {user1?.age}</p>
          </div>
          <div className="flex">
            <h1>Gender: </h1>
            <p>&nbsp; {user1?.gender}</p>
          </div>
          <div className="flex">
            <h1>Status: </h1>
            <p>&nbsp; {user1?.status}</p>
          </div>
          <div className="flex">
            <h1>About: </h1>
            <p>&nbsp; {user1?.description}</p>
          </div>
        </div>
        {user?._id !== user1?._id && (
          <button className="p-2 bg-gray-300" onClick={handleMessage}>
            Send message
          </button>
        )}
      </div>
    </>
  );
}
