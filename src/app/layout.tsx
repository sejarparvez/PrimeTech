import CategorySection from "@/components/core/CategorySection";
import { SideBar } from "@/components/layout/SideBar";
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
  session: any;
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider session={session}>
          <Navbar />
          <div className="mx-2 my-20 grid-cols-10 gap-6 md:mx-10 lg:grid">
            <div className="top-14 z-20 col-span-2 mt-6  hidden lg:sticky lg:left-3 lg:mt-0 lg:block lg:h-screen">
              <SideBar />
            </div>
            <div className="col-span-8">{children}</div>
          </div>
          <div className="mb-10 lg:hidden">
            <CategorySection />
          </div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
