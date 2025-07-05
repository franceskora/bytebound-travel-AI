import { useTheme } from "../../context/theme-context";
import { Moon, Sun } from 'lucide-react';
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-primary hover:bg-secondary transition bg-light dark:bg-gray-800 dark:hover:bg-gray-700"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </button>
  );
};

export default ThemeToggle;