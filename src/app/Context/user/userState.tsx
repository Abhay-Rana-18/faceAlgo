'use client';
import { useEffect, useState } from "react";
import UserContext from "./userContext";
import { toast } from "react-toastify";
import axios from "axios";


const UserState = (props: any) => {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check for token in localStorage when the component mounts
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    else {
      setIsLoggedIn(false);
    }
  }, []);
  const getUser = async () => {
    try {
      const { data } = await axios.get("/api/users/details");
      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
      }
      console.log(data.message);
      return data;
    } catch (e) {
      setIsLoggedIn(false);
    }
  };

  const userLogin = async ({ email, password }: any) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "/api/users/login",
        {
          email,
          password,
        },
        config
      );
      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
      }
      return data;
    } catch (error) {
      toast.error("User login failed!");
    }
  };

  const userSignup = async ({ name, email, password, gender, age, status, description, imageUrl }: any) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "/api/users/signup",
        {
          name,
          email,
          age,
          status,
          password,
          gender,
          imageUrl,
          description
        },
        config
      );
      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
      }
      return data;
    } catch (error) {
      toast.error("User sinup failed!");
    }
  };

  const userLogout = async() => {
    setIsLoggedIn(false);
    setUser(null);
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        setUser,
        getUser,
        userLogin,
        userSignup,
        userLogout,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
