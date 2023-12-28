import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Short() {
  return (
    <Select>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Sort By Time" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Newest</SelectItem>
        <SelectItem value="banana">Oldest</SelectItem>
      </SelectContent>
    </Select>
  );
}
