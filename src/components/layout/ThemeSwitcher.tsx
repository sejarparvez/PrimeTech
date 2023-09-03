import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const isLightTheme = theme === "light";

  // On the client side, after the component mounts, set the mounted state to true
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Return null while the component is mounting on the client

  return (
    <div
      className={`w-fit p-2 rounded-md duration-200 text-primary-200 dark:text-lightgray-100 bg-slate-200 dark:bg-[#212933]`}
      onClick={() => setTheme(isLightTheme ? "dark" : "light")}
    >
      {isLightTheme ? <FiSun /> : <FiMoon />}
    </div>
  );
};
