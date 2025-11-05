import { Code2, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";

function Navbar({ darkMode, onDarkModeToggle }) {
  return (
    <div
      className="h-16 glass-panel flex items-center justify-between px-6 border-b"
      style={{ borderColor: "var(--editor-border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background:
              "linear-gradient(to bottom right, var(--editor-neon-blue), var(--editor-neon-cyan))",
          }}
        >
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <h1 className="tracking-wider" style={{ color: "var(--editor-text)" }}>
          STEGA-EDITOR
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Sun
            className="w-4 h-4"
            style={{ color: "var(--editor-text-muted)" }}
          />
          <Switch
            checked={darkMode}
            onCheckedChange={onDarkModeToggle}
            className={`data-[state=checked]:bg-[var(--editor-neon-blue)] ${
              darkMode
                ? "border border-transparent" // No border in dark mode
                : "border border-[var(--editor-border)]" // Border in light mode
            }`}
          />
          <Moon
            className="w-4 h-4"
            style={{ color: "var(--editor-text-muted)" }}
          />
        </div>
        <Avatar
          className="w-9 h-9 border-2"
          style={{ borderColor: "var(--editor-neon-blue)" }}
        >
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
          <AvatarFallback
            className="text-white"
            style={{ backgroundColor: "var(--editor-neon-blue)" }}
          >
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default Navbar;
