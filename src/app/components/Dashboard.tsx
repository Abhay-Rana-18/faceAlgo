"use client";
import Image, { StaticImageData } from "next/image";
import camera from "../../../public/images/camera.jpg";
import cam2 from "../../../public/images/cam2.png";
import cam from "../../../public/images/cam.jpg";
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Avatar } from "@mui/material";
import { findMostSimilarFace } from "../logic/algo";
import ronaldo from "./../logic/Amir.jpg";
import { useRouter } from "next/navigation";

export default function () {
  const router = useRouter();
  const webcamRef = React.useRef<any>(null);
  const [imageSrc, setImageSrc] = useState<any>(null);
  const [isCam, setIsCam] = useState(false);
  const [img, setImg] = useState<any>(
    "/images/gallery.jpg"
  );
  const [users, setUser] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const myRef = useRef<any>(null);
  const fetchData = async () => {
    const response = fetch("/api/users");
    const data = await (await response).json();
    setUser(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = (userId: String) => {
    router.push(`/profile/${userId}`);
  };

  const findFaces = async () => {
    const res = await findMostSimilarFace(img, users);
    setResult(res);
  };

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
          console.log("Unexpected reader.result type:", reader.result);
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

    myRef?.current?.click();
  };
  const capture = React.useCallback(() => {
    const image:any = webcamRef?.current?.getScreenshot();
    setImg(image);
    setIsCam(false);
  }, [webcamRef]);
  return (
    <>
      <div className="upload gap-3 flex justify-center md:mt-2 px-0 md:px-10 flex-col md:flex-row">
        <div className="first w-full md:w-1/2 px-1">
          {isCam == true ? (
            <>
              <div className="camera-container w-full bg-gray-200">
                <Webcam
                  audio={false}
                  width="100%"
                  ref={webcamRef}
                  className="!w-screen md:!w-full !h-[60vh]"
                />
                <button
                  className="p-2 bg-blue-600/80 text-white m-auto block mt-5  text-xs sm:text-sm md:text-md lg:text-[1rem]"
                  onClick={capture}
                >
                  Capture Image
                </button>
                <img
                  src='images/cam.jpg'
                  alt="#"
                  className="rounded-full w-[60px] h-[60px] md:w-[70px] md:h-[70px]"
                  onClick={toggleCam}
                />
              </div>
            </>
          ) : (
            <div className="bg-gray-200">
              <img
                src={`${img}`}
                alt="#"
                className="h-[60vh] m-auto object-cover"
              />
              <div className="select flex justify-center mt-4 gap-2">
                <img
                  src="/images/gallery.jpg"
                  alt="#"
                  className="rounded-full w-[60px] h-[60px] md:w-[70px] md:h-[70px]"
                  onClick={selectFile}
                />
                <img
                  src="/images/cam2.png"
                  alt="#"
                  className="rounded-full w-[60px] h-[60px] md:w-[70px] md:h-[70px]"
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
              <div
                className="btn my-3 bg-blue-600/70 text-white text-center py-2 w-full"
                onClick={findFaces}
              >
                find
              </div>
            </div>
          )}
        </div>

        <div className="second matches bg-gray-100 md:w-1/2 w-full px-1">
          {/* {result !== null && (
              <div
                className="profile m-3 p-2 flex bg-slate-200 rounded-lg"
                key={result._id}
              >
                <Avatar src={result.imageUrl} sx={{ width: 45, height: 45 }} />
                <div className="mx-2">
                  <h3 className="name">{result?.email}</h3>
                  <p className="gender font-light">{result.gender}</p>
                </div>
              </div>
            )} */}
          {result?.map((user:any) => (
            <div
              className="profile m-3 p-2 flex bg-slate-200 rounded-lg w-full"
              key={user?._id}
              onClick={() => {
                handleClick(user._id);
              }}
            >
              <Avatar src={user?.imageUrl} sx={{ width: 45, height: 45 }} />
              <div className="mx-2">
                <h3 className="name">{user?.email}</h3>
                <p className="gender font-light">{user?.gender}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
