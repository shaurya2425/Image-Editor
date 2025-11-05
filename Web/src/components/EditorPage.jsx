import { useState, useRef } from "react";
import LeftSidebar from "../components/LeftSidebar";
import Canvas from "../components/Canvas"; // If a separate upload UI is still used
import Editor from "../components/Editor"; // Your main Editor.jsx
import RightPanel from "../components/RightPanel";
import BottomBar from "../components/BottomBar";

export default function EditorPage() {
  const [selectedTool, setSelectedTool] = useState("none");
  const [imageFile, setImageFile] = useState(null);
  const editorRef = useRef(null);

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId);
  
    if (toolId === "crop" && editorRef.current) {
      editorRef.current.InitiateCrop(); // ✅ Calls the crop logic
    }
  };
  
  const handleImageUpload = (file) => {
    setImageFile(file);
    setSelectedTool("none");
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar */}
      <LeftSidebar selectedTool={selectedTool} onToolSelect={handleToolSelect} />

      {/* Canvas or Editor depending on whether an image is loaded */}
      {imageFile ? (
        <Editor ref={editorRef} IMG={imageFile} Name={imageFile?.name} />
      ) : (
        <Canvas onImageUpload={handleImageUpload} />
      )}

      {/* Right Panel */}
      {imageFile && <RightPanel />}

      {/* Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomBar />
      </div>
    </div>
  );
}
