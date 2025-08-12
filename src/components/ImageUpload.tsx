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
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      onFilesChange(files);
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
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

      <div
        className="border-2 border-dashed rounded-lg p-6 py-16 text-center flex flex-col justify-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <FaUpload className="h-8 w-8 text-gray-500 mx-auto" />
        <span className="text-sm text-gray-500 mt-2">
          Click to upload {multiple ? "images" : "image"} or drag and drop
        </span>
      </div>

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
