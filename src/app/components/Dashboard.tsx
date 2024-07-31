"use client";
import cam from "../../../public/images/cam.jpg";
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Avatar } from "@mui/material";
import { findMostSimilarFace } from "../logic/algo";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function () {
  const router = useRouter();
  const webcamRef = React.useRef<any>(null);
  const [gen, setGen] = useState<any>("any");
  const [isCam, setIsCam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [loading2, setLoading2] = useState(false);
  const [img, setImg] = useState<any>("/images/gallery.jpg");
  const [users, setUser] = useState<any[]>([]);
  const [result, setResult] = useState<any>([]);
  const myRef = useRef<any>(null);

  const handleClick = (userId: String) => {
    router.push(`/profile/${userId}`);
  };

  const findFaces = async () => {
    setLoading2(true);
    try {
      const response = fetch(`/api/users/${gen}`);
      const data = await (await response).json();
      console.log(data);
      const res = await findMostSimilarFace(img, data);
      setResult(res);
      toast.success("Similar faces found successfully!");
    } catch (e) {
      toast.error("Error while finding faces.");
    } finally {
      setLoading2(false);
    }
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
    const image: any = webcamRef?.current?.getScreenshot();
    setImg(image);
    setIsCam(false);
  }, [webcamRef]);

  return (
    <>
      <div className="upload gap-3 flex justify-center md:mt-2 px-0 md:px-10 flex-col md:flex-row !mt-[3.1rem]">
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
                  src="images/cam.jpg"
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
              <div className="my-6">
                <div
                  className={`text-center ${
                    open ? "flex" : "hidden"
                  } flex-col gap-1 w-1/2 m-auto`}
                >
                  <div
                    className={`${
                      gen === "male" ? "bg-green-200" : "bg-white"
                    } py-2`}
                    onClick={() => {
                      setGen("male");
                    }}
                  >
                    male
                  </div>
                  <div
                    className={`${
                      gen === "female" ? "bg-green-200" : "bg-white"
                    } py-2`}
                    onClick={() => {
                      setGen("female");
                    }}
                  >
                    female
                  </div>
                  <div
                    className={`${
                      gen === "any" ? "bg-green-200" : "bg-white"
                    } py-2`}
                    onClick={() => {
                      setGen("any");
                    }}
                  >
                    any
                  </div>
                </div>

                <div className="my-2 py-2 flex bg-blue-600/70 text-white items-center">
                  <div className="btn text-center w-full" onClick={findFaces}>
                    find
                  </div>
                  <div
                    className="h-full flex ml-auto px-3 text-lg font-bold text-white cursor-pointer"
                    onClick={() => {
                      setOpen(!open);
                    }}
                  >
                    ^
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="second matches bg-gray-100 md:w-1/2 w-full px-1">
          {loading2 ? (
            <div className="flex items-center min-h-[90%]">
              <img
                src="/images/user_search.gif"
                alt="finding..."
                className="m-auto"
              />
            </div>
          ) : (
            <>
              {result.length == 0 ? (
                <div className="flex items-center min-h-[90%] justify-center">
                  No user found
                </div>
              ) : (
                result?.map((user: any) => (
                  <div
                    className="profile m-3 p-2 flex bg-slate-200 rounded-lg w-full"
                    key={user?._id}
                    onClick={() => {
                      handleClick(user._id);
                    }}
                  >
                    <Avatar
                      src={user?.imageUrl}
                      sx={{ width: 45, height: 45 }}
                    />
                    <div className="mx-2">
                      <h3 className="name">{user?.name}</h3>
                      <p className="gender font-light">{user?.gender}</p>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
