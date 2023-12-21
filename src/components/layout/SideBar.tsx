"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import options from "../common/post/Options";
const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export function SideBar() {
  return (
    <ScrollArea className="h-[86%] rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-2xl font-medium">Categories</h4>
        {options.map((category, index) => (
          <>
            <Link
              href={`/category/${category.value}`}
              className=" hover:text-primary hover:font-medium hover:tracking-wider transition-all duration-300"
            >
              <div key={index} className=" py-2">
                {category.label}
              </div>
              <Separator />
            </Link>
          </>
        ))}
      </div>
    </ScrollArea>
  );
}
