import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Provider from "../../context/Provider";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrimeTech",
  description: "PrimeTech is a technology-based blog site.",
};

interface RootLayoutProps {
  children: ReactNode;
  session: any; // Replace 'any' with the actual type of your 'session' prop
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider session={session}>
          <Navbar />
          <div className="my-20">{children}</div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
