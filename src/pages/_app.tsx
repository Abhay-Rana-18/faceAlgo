'use client';
import { store } from "@/redux/store";
import { AppProps } from "next/app";
import { Provider } from "react-redux";

function MyApp({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Provider store={store}>{children}</Provider>;
}

export default MyApp;
