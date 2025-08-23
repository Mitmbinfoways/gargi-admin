import { useRef } from "react";
import { FaUpload, FaTimes } from "react-icons/fa";

interface ImageUploadProps {
  multiple?: boolean;
  previewUrls: string[];
  onFilesChange: (files: File[]) => void;
  onRemove?: (index: number) => void;
  height?: string;
}

export default function ImageUpload({
  multiple = false,
  previewUrls,
  onFilesChange,
  onRemove,
  height = "h-32",
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      onFilesChange(files);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      onFilesChange(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-4">
      {/* Preview Section */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {previewUrls.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className={`w-full ${height} object-cover rounded-lg border`}
              />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-400"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Section */}
      <div
        className="border-2 border-dashed rounded-lg p-6 py-16 text-center flex flex-col justify-center cursor-pointer transition hover:bg-gray-50 bg-white"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <FaUpload className="h-8 w-8 text-gray-500 mx-auto" />
        <span className="text-sm text-gray-500 mt-2">
          Click to upload {multiple ? "images" : "image"} or drag and drop
        </span>
        <span className="text-xs text-gray-400 mt-1">(Only image files allowed)</span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
