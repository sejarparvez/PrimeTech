import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { Button } from "../ui/button";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const isLightTheme = theme === "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isLightTheme ? "dark" : "light")}
      >
        {isLightTheme ? <FiSun /> : <FiMoon />}
      </Button>
    </>
  );
};
