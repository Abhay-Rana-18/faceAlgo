import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import UserState from "./Context/user/userState";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Face-Algo",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserState>
          <Navbar />
          {children}
        </UserState>
      </body>
    </html>
  );
}
