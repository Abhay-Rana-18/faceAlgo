"use client";
import React, { useEffect } from "react";
import {
  Card,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  OutlinedInput,
  IconButton,
  CardContent,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import axios from "axios";
import { SettingsEthernetRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      // router.push("/");
    }
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // imageUrl
  type FileType = File | null | undefined; // Define a type for the file

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile: FileType = event.target.files?.[0]; // Get the first selected file with type

    if (selectedFile) {
      // Check if a file is actually selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string); // Set the image URL after reading the file (cast to string)
      };
      reader.readAsDataURL(selectedFile); // Read the file as a data URL
    }
  };

  // Sign up
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const data = {
      name,
      email,
      age,
      status,
      password,
      gender,
      imageUrl,
      description
    };

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData.success && typeof window !== undefined) {
        localStorage.setItem("token", responseData.token);
        router.push("/");
      }
      console.log(responseData); // Handle successful response
    } catch (error) {
      console.error(error); // Handle errors
    }
  };
  return (
    <>
      <div>
        <div
          style={{
            marginTop: 10,
            marginBottom: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant={"h6"}>
            Welcome to FaceAlog. Sign up below
          </Typography>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card
            style={{
              width: 400,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <CardContent>
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <TextField
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  fullWidth={true}
                  label="Full Name"
                  variant="outlined"
                  value={name}
                />
                <TextField
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  fullWidth={true}
                  label="Email"
                  variant="outlined"
                  value={email}
                />
                <TextField
                  onChange={(event) => {
                    setAge(event.target.value);
                  }}
                  fullWidth={true}
                  label="Age"
                  type='number'
                  variant="outlined"
                  value={age}
                />

                <FormControl fullWidth={true} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="gender">Gender</InputLabel>
                  <Select
                    labelId="gender"
                    id="demo-simple-select"
                    label="Gender"
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                    }}
                  >
                    <MenuItem value="male">male</MenuItem>
                    <MenuItem value="female">female</MenuItem>
                    <MenuItem value="other">other</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="status">Status</InputLabel>
                  <Select
                    labelId="status"
                    id="demo-simple-select"
                    label="Status"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  >
                    <MenuItem value="single">single</MenuItem>
                    <MenuItem value="relationship">relationship</MenuItem>
                    <MenuItem value="married">married</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                  fullWidth={true}
                  label="Desciption"
                  variant="outlined"
                />

                <TextField
                  onChange={handleChange}
                  fullWidth={true}
                  variant="outlined"
                  type="file"
                />

                <Button
                  size={"large"}
                  variant="outlined"
                  style={{ marginTop: "1rem" }}
                  type="submit"
                >
                  {" "}
                  Signup
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default page;
