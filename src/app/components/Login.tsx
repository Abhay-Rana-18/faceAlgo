"use client";
import React, { useContext, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import UserContext from "../Context/user/userContext";
// import { cookies } from 'next/headers'

export default function () {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {userLogin} = useContext<any>(UserContext);
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

  // Login
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      const responseData = await userLogin(data);
      if (responseData.success) {
        toast.success("User logined successfully!");
        localStorage.setItem("token", responseData.token);
        router.push("/");
      }
    } catch (error) {
      toast.warning("Invalid Username/passowrd");
    }
  };
  return (
    <>
      <div>
        <div
          style={{
            paddingTop: 150,
            marginBottom: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant={"h6"}>
            Login below
          </Typography>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card
            style={{
              width: 500,
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
                    setEmail(event.target.value);
                  }}
                  fullWidth={true}
                  label="Email"
                  variant="outlined"
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

                <Button
                  size={"large"}
                  variant="outlined"
                  style={{ marginTop: "1rem" }}
                  type="submit"
                >
                  {" "}
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};


