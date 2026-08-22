import { useRef, useState } from "react";
import {
  UploadCloud,
  FileCheck,
  X,
} from "lucide-react";

export default function FileUpload({
  title,
  description = "PDF, JPG or PNG",
  accept = "image/*,.pdf",
  file,
  onFileSelect,
  onRemove,
}) {

  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (selected) => {

    if (!selected) return;

    onFileSelect(selected);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg">

      <div className="p-5 border-b border-slate-100">

        <div className="flex justify-between">

          <div>

            <p className="text-sm font-semibold text-[#17212b]">
              {title}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              {description}
            </p>

          </div>

          <div className="text-xs text-slate-400">
            REQUIRED
          </div>

        </div>

      </div>

      <div className="p-5">

        {file ? (

          <div className="flex items-center border border-green-200 bg-green-50 rounded-md p-4">

            <FileCheck
              size={22}
              className="text-green-600"
            />

            <div className="ml-3 flex-1 min-w-0">

              <p className="text-sm font-medium text-green-800 truncate">
                {file.name}
              </p>

              <p className="text-xs text-green-600 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB · Ready for analysis
              </p>

            </div>

            <button
              onClick={onRemove}
              className="text-slate-400 hover:text-red-500"
            >
              <X size={18} />
            </button>

          </div>

        ) : (

          <div
            onClick={() =>
              inputRef.current?.click()
            }
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() =>
              setDragging(false)
            }
            onDrop={(e) => {

              e.preventDefault();
              setDragging(false);

              handleFile(
                e.dataTransfer.files?.[0]
              );

            }}
            className={`h-32 border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition ${
              dragging
                ? "border-[#1677b8] bg-blue-50"
                : "border-slate-300 hover:border-[#1677b8] hover:bg-slate-50"
            }`}
          >

            <UploadCloud
              size={25}
              className="text-slate-400"
            />

            <p className="text-xs font-medium text-slate-600 mt-2">
              Upload document
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              Drag & drop or click to browse
            </p>

            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) =>
                handleFile(
                  e.target.files?.[0]
                )
              }
            />

          </div>

        )}

      </div>

    </div>
  );
}