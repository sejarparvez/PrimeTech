import { useSession } from "next-auth/react";
import { ChangeEventHandler, FC } from "react";
import optionsWithLinks from "../common/post/Options";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CategoriesProps {
  onChange: ChangeEventHandler<HTMLSelectElement>;
  error?: string;
  selectedCategory: string;
}

const Filter: FC<CategoriesProps> = ({ onChange, error, selectedCategory }) => {
  const { data: session } = useSession();
  const Admin = session?.user?.email;

  return (
    <Select>
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Sort By Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="max-h-80 overflow-y-auto">
          {optionsWithLinks.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Filter;
