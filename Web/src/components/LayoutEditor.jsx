import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
export default function LayoutEditor() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--editor-bg)] text-[var(--editor-text)]">
      {/* Always visible Navbar */}
      <Navbar />

      {/* Main App Layout with Sidebar, Canvas, and Right Panel */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar and Right Panel should render inside these child components */}
        <Outlet />
      </main>
    </div>
  );
}
