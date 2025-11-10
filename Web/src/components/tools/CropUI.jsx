import { useState, useRef } from 'react';
import { Check, X } from 'lucide-react';

export default function CropUI({ width, height, onApply, onCancel }) {
    const [crop, setCrop] = useState({
        x: width * 0.1,
        y: height * 0.1,
        width: width * 0.8,
        height: height * 0.8,
    });
    const [dragging, setDragging] = useState(null);
    const startPos = useRef({ x: 0, y: 0, crop: null });

    const handleMouseDown = (e, handle) => {
        e.preventDefault();
        setDragging(handle);
        startPos.current = {
            x: e.clientX,
            y: e.clientY,
            crop: { ...crop },
        };
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;

        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        const startCrop = startPos.current.crop;

        let newCrop = { ...crop };

        switch (dragging) {
            case 'move':
                newCrop.x = Math.max(0, Math.min(width - startCrop.width, startCrop.x + dx));
                newCrop.y = Math.max(0, Math.min(height - startCrop.height, startCrop.y + dy));
                break;
            case 'nw':
                newCrop.x = Math.max(0, startCrop.x + dx);
                newCrop.y = Math.max(0, startCrop.y + dy);
                newCrop.width = startCrop.width - dx;
                newCrop.height = startCrop.height - dy;
                break;
            case 'ne':
                newCrop.y = Math.max(0, startCrop.y + dy);
                newCrop.width = startCrop.width + dx;
                newCrop.height = startCrop.height - dy;
                break;
            case 'sw':
                newCrop.x = Math.max(0, startCrop.x + dx);
                newCrop.width = startCrop.width - dx;
                newCrop.height = startCrop.height + dy;
                break;
            case 'se':
                newCrop.width = startCrop.width + dx;
                newCrop.height = startCrop.height + dy;
                break;
            default:
                break;
        }

        // Ensure minimum size
        if (newCrop.width < 50) newCrop.width = 50;
        if (newCrop.height < 50) newCrop.height = 50;

        // Ensure within bounds
        if (newCrop.x + newCrop.width > width) newCrop.width = width - newCrop.x;
        if (newCrop.y + newCrop.height > height) newCrop.height = height - newCrop.y;

        setCrop(newCrop);
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    return (
        <div
            className="absolute inset-0 cursor-move"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50" />

            {/* Crop area */}
            <div
                className="absolute border-2 border-white bg-transparent"
                style={{
                    left: crop.x,
                    top: crop.y,
                    width: crop.width,
                    height: crop.height,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'move')}
            >
                {/* Handles */}
                <div
                    className="absolute w-3 h-3 bg-white border border-gray-800 rounded-full cursor-nw-resize"
                    style={{ left: -6, top: -6 }}
                    onMouseDown={(e) => handleMouseDown(e, 'nw')}
                />
                <div
                    className="absolute w-3 h-3 bg-white border border-gray-800 rounded-full cursor-ne-resize"
                    style={{ right: -6, top: -6 }}
                    onMouseDown={(e) => handleMouseDown(e, 'ne')}
                />
                <div
                    className="absolute w-3 h-3 bg-white border border-gray-800 rounded-full cursor-sw-resize"
                    style={{ left: -6, bottom: -6 }}
                    onMouseDown={(e) => handleMouseDown(e, 'sw')}
                />
                <div
                    className="absolute w-3 h-3 bg-white border border-gray-800 rounded-full cursor-se-resize"
                    style={{ right: -6, bottom: -6 }}
                    onMouseDown={(e) => handleMouseDown(e, 'se')}
                />
            </div>

            {/* Action buttons */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <button
                    onClick={() => onApply(crop)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600"
                >
                    <Check className="w-4 h-4" />
                    Apply Crop
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </button>
            </div>
        </div>
    );
}