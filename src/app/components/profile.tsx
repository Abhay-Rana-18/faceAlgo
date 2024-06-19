"use client";
import { useEffect, useState } from "react";
import gallery from "../../../public/images/gallery.jpg";
import Image from "next/image";
import axios from "axios";

interface UserI {
  _id: any,
  email: string,
  password: string,
  gender: string,
  imageUrl: string
};

export default function ({id}) {                     // id: 6635fa61dd01c19d17e1e560
  const [user, setUser] = useState<UserI | undefined>();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {data} = await axios.get(`/api/users/${String(id)}`);
        if (data) {
          setUser(data.user);
        } else {
          console.log(`Error`);
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    }
    fetchUser(); 
  }, []);

  const handleMessage = async() => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // const {data} = await axios.post("/api/chat", {id}, config);
      const {data} = await axios.post("/api/chat", {id}, config);
      console.log(data);
    }
    catch(e) {
      console.log(e);
    }
  }
  return (
    <>
      <h1 className="text-center mt-3 font-mono text-lg">User Profile</h1>
      <div className="flex flex-col items-center justify-center h-full mt-5">
        <div className="img">
          <Image src={user?.imageUrl} width={250} height={300} alt="#" />
        </div>
        <div className="desc p-3">
          <div className="flex">
            <h1>Name: </h1>
            <p>&nbsp; {user?.email}</p>
          </div>
          <div className="flex">
            <h1>Age: </h1>
            <p>&nbsp; 39</p>
          </div>
          <div className="flex">
            <h1>Gender: </h1>
            <p>&nbsp; {user?.gender}</p>
          </div>
          <div className="flex">
            <h1>Status: </h1>
            <p>&nbsp; Single</p>
          </div>
          <div className="flex">
            <h1>About: </h1>
            <p>&nbsp; Chapri football player....gota</p>
          </div>
        </div>
        <button className="p-2 bg-gray-300" onClick={handleMessage}>Send message</button>
      </div>
    </>
  );
}
