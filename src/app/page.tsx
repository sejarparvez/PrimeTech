import CategorySection from "@/components/core/CategorySection";
import Featured from "@/components/core/Featured";
import HotPost from "@/components/core/HotPost";
import RecentPost from "@/components/core/RecentPost";
import Sidebar from "@/components/layout/SideBar";

export default function Home() {
  return (
    <main className="flex gap-4">
      <div className="hidden lg:block lg:sticky  z-20 top-14 lg:left-3 lg:h-screen mt-6  lg:mt-0">
        <Sidebar />
      </div>

      <div className="flex flex-col w-full gap-16">
        <Featured />
        <HotPost />
        <RecentPost />
        <div className="lg:hidden">
          <CategorySection />
        </div>
      </div>
    </main>
  );
}
