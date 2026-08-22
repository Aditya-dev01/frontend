import { useState } from "react";
import {
  ScanSearch,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import FileUpload from "../components/FileUpload";

export default function DocumentUpload() {

  const navigate = useNavigate();

  const [files, setFiles] = useState({
    passport: null,
    visa: null,
    nationalId: null,
    license: null,
    permit: null,
    personPhoto: null,
  });

  const setFile = (name, file) => {

    setFiles((prev) => ({
      ...prev,
      [name]: file,
    }));

  };

  const removeFile = (name) => {

    setFiles((prev) => ({
      ...prev,
      [name]: null,
    }));

  };

  const startScreening = () => {

    const hasDocument =
      files.passport ||
      files.visa ||
      files.nationalId ||
      files.license ||
      files.permit;

    if (!hasDocument) {

      alert(
        "Please upload at least one identity document."
      );

      return;
    }

    navigate("/screening/DEMO-001/ocr");
  };

  return (
    <div className="max-w-[1250px] mx-auto">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-7">

        <div>

          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <ScanSearch size={14} />
            SCREENING / NEW CASE
          </div>

          <h1 className="text-2xl font-bold text-[#17212b]">
            New Identity Screening
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Submit identity documents for AI-assisted verification.
          </p>

        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0 text-xs text-slate-500">

          <ShieldCheck
            size={16}
            className="text-green-600"
          />

          Secure upload channel

        </div>

      </div>

      {/* Uploads */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

        <FileUpload
          title="Passport"
          file={files.passport}
          onFileSelect={(file) =>
            setFile("passport", file)
          }
          onRemove={() =>
            removeFile("passport")
          }
        />

        <FileUpload
          title="Visa"
          file={files.visa}
          onFileSelect={(file) =>
            setFile("visa", file)
          }
          onRemove={() =>
            removeFile("visa")
          }
        />

        <FileUpload
          title="National Identity Card"
          file={files.nationalId}
          onFileSelect={(file) =>
            setFile("nationalId", file)
          }
          onRemove={() =>
            removeFile("nationalId")
          }
        />

        <FileUpload
          title="Driving License"
          file={files.license}
          onFileSelect={(file) =>
            setFile("license", file)
          }
          onRemove={() =>
            removeFile("license")
          }
        />

        <FileUpload
          title="Permit / Residence Document"
          file={files.permit}
          onFileSelect={(file) =>
            setFile("permit", file)
          }
          onRemove={() =>
            removeFile("permit")
          }
        />

        <FileUpload
          title="Person Photograph"
          description="Clear frontal face photograph"
          accept="image/*"
          file={files.personPhoto}
          onFileSelect={(file) =>
            setFile("personPhoto", file)
          }
          onRemove={() =>
            removeFile("personPhoto")
          }
        />

      </div>

      {/* Action */}

      <div className="mt-7 bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center gap-4">

        <div>

          <p className="text-sm font-semibold text-[#17212b]">
            Ready to begin screening?
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Uploaded documents will be processed by the verification pipeline.
          </p>

        </div>

        <button
          onClick={startScreening}
          className="px-6 py-3 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-md text-sm font-semibold flex items-center gap-2"
        >

          Start AI Screening

          <ArrowRight size={17} />

        </button>

      </div>

    </div>
  );
}