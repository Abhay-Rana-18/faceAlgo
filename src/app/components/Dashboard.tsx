"use client";
import Image, { StaticImageData } from "next/image";
import gallery from "../../../public/images/gallery.jpg";
import camera from "../../../public/images/camera.jpg";
import cam2 from "../../../public/images/cam2.png";
import cam from "../../../public/images/cam.jpg";
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Avatar } from "@mui/material";
import { findMostSimilarFace } from "../logic/algo";
import ronaldo from "./../logic/christiano.jpg";

export default function () {
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCam, setIsCam] = useState(false);
  const [img, setImg] = useState<String | StaticImageData>(gallery);
  const [users, setUser] = useState<any[]>([]);
  const myRef = useRef(null);
  const fetchData = async () => {
    const response = fetch("/api/users");
    const data = await (await response).json();
    setUser(data);
  };
  useEffect(() => {
    fetchData();
    setImg(ronaldo);
  }, []);

  const findFaces = async() => {
    findMostSimilarFace(img, users);
  }

  type FileType = File | null; // Define a type for the file

  const fileUploadHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: FileType = e?.target?.files?.[0] as File; // Type the file
    if (!file) {
      return; // Handle no file selected case
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === FileReader.DONE) {
        // Use FileReader.DONE for clarity
        if (typeof reader.result === "string") {
          // Type check result
          const url = reader.result;
          setImg(url);
        } else {
          console.error("Unexpected reader.result type:", reader.result);
        }
      }
    };

    reader.readAsDataURL(file);
  };

  const toggleCam = () => {
    setIsCam(!isCam);
    if (img == cam) {
      //   setImg(cam2);
    } else {
      //   setImg(cam);
    }
  };
  const selectFile = () => {
    myRef.current.click();
  };
  const capture = React.useCallback(() => {
    const image = webcamRef?.current?.getScreenshot();
    setImg(image);
    setIsCam(false);
  }, [webcamRef]);
  return (
    <>
      <div className="">
        <div className="upload gap-3 flex justify-center mt-2">
          {isCam == true ? (
            <>
              <div className="camera-container w-[500px] h-[500px] bg-gray-200">
                <Webcam
                  audio={false}
                  width={500}
                  height={500}
                  ref={webcamRef}
                />
                <button
                  className="p-2 bg-blue-600 text-white m-auto block mt-5"
                  onClick={capture}
                >
                  Capture Image
                </button>
                <Image
                  src={cam}
                  alt="#"
                  width={70}
                  height={70}
                  className="rounded-full"
                  onClick={toggleCam}
                />
              </div>
            </>
          ) : (
            <div className="w-[500px] h-[500px] bg-gray-200">
              <Image
                src={img}
                alt="#"
                width={400}
                height={0}
                className="ml-[50px]"
              />
              <div className="select flex justify-center mt-4 gap-2">
                <Image
                  src={gallery}
                  alt="#"
                  width={70}
                  height={70}
                  className="rounded-full"
                  onClick={selectFile}
                />
                <Image
                  src={cam}
                  alt="#"
                  width={70}
                  height={70}
                  className="rounded-full"
                  onClick={toggleCam}
                />
              </div>
              <input
                className="hidden"
                type="file"
                accept="image/"
                ref={myRef}
                onChange={fileUploadHandle}
              />
              <div className="btn m-3 p-3 bg-blue-600 text-white text-center w-full" onClick={findFaces}>find</div>
            </div>
          )}

          <div className="matches bg-gray-100 w-[500px] h-[500px]">
            {users?.map((user) => (
              <div className="profile m-3 p-2 flex bg-slate-200 rounded-lg" key={user._id}>
                <Avatar src={user?.imageUrl} sx={{ width: 45, height: 45 }} />
                <div className="mx-2">
                  <h3 className="name">{user?.email}</h3>
                  <p className="gender font-light">{user.gender}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
