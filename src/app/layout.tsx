import CategorySection from "@/components/core/CategorySection";
import Sidebar from "@/components/layout/SideBar";
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
          <div className="lg:grid grid-cols-10 mx-2 md:mx-10 my-20 gap-6">
            <div className="hidden lg:block lg:sticky col-span-2  z-20 top-14 lg:left-3 lg:h-screen mt-6 lg:mt-0">
              <Sidebar />
            </div>
            <div className="col-span-8">{children}</div>
          </div>
          <div className="lg:hidden">
            <CategorySection />
          </div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
