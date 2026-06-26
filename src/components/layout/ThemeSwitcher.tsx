import { useTheme } from '../../lib/ThemeProvider';

export default function ThemeSwitcher() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-xl bg-glass-medium border border-default text-muted hover:text-gold-500 hover:border-gold-500/30 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <i className="fa-solid fa-sun text-sm" />
      ) : (
        <i className="fa-solid fa-moon text-sm" />
      )}
    </button>
  );
}
