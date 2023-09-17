import CategorySection from "@/components/core/CategorySection";
import Featured from "@/components/core/Featured";
import HotPost from "@/components/core/HotPost";
import RecentPost from "@/components/core/RecentPost";

export default function Home() {
  return (
    <main className="flex flex-col gap-16">
      <Featured />
      <HotPost />
      <RecentPost />
      <div className="lg:hidden">
        <CategorySection />
      </div>
    </main>
  );
}
