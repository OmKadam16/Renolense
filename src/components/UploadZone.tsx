import React, { useRef } from "react";

interface Props {
  type: "room" | "inspiration";
  preview: string | null;
  placeholderImg: string;
  placeholderLabel: string;
  onFile: (file: File) => void;
}

export default function UploadZone({ type, preview, placeholderImg, placeholderLabel, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const isRoom = type === "room";

  return (
    <div className="flex flex-col">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`min-h-[280px] bg-white border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/20 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
          preview ? "border-solid border-blue-200" : ""
        }`}
      >
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />

        {preview ? (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={preview}
              alt={`${type} preview`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 hover:bg-black/30 transition-all flex items-center justify-center">
              <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold text-gray-800 shadow-sm translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Change Photo
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-4">{isRoom ? "📷" : "✨"}</span>
            <p className="font-semibold text-gray-700 text-sm mb-1">
              {isRoom ? "Upload Your Room" : "Upload Your Inspiration"}
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Tap to browse, or drag and drop
            </p>
            <button className="px-4 py-1.5 border border-gray-300 text-gray-500 font-semibold text-xs rounded-lg hover:bg-gray-50 transition-colors">
              Browse Files
            </button>

            <div className="mt-6 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="w-32 aspect-video rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-gray-50">
                <img
                  src={placeholderImg}
                  alt="Sample preview template"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-2">
                {placeholderLabel}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
