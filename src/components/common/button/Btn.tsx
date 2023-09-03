import Link from "next/link";

type Props = {
  link: string;
  text: string;
};

export default function Btn({ link, text }: Props) {
  return (
    <Link href={link}>
      <button className="bg-primary-200 dark:bg-btn-100 px-4 py-2 rounded-md text-sm text-lightgray-100 dark:text-primary-200 font-bold">
        {text}
      </button>
    </Link>
  );
}
