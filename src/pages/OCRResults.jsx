import {
  CheckCircle,
  FileText,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const extractedData = {
  name: "Rahul Sharma",
  passportNumber: "P1234567",
  nationality: "Indian",
  dob: "12/05/1999",
  gender: "Male",
  expiry: "12/05/2030",
  placeOfBirth: "New Delhi",
  documentType: "Indian Passport",
};

export default function OCRResults() {

  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div>

        <h1 className="text-2xl font-bold text-white">
          OCR Extraction Results
        </h1>

        <p className="text-slate-400 mt-1">
          Information extracted from the uploaded document
        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Document preview */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <h2 className="text-white font-semibold mb-5">
            Document Preview
          </h2>

          <div className="h-80 rounded-lg bg-slate-800 flex items-center justify-center">

            <div className="text-center">

              <FileText
                size={60}
                className="mx-auto text-slate-600"
              />

              <p className="text-slate-500 mt-3">
                Passport Preview
              </p>

            </div>

          </div>

        </div>

        {/* OCR Data */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-white font-semibold">
              Extracted Information
            </h2>

            <span className="flex items-center gap-1 text-green-400 text-sm">
              <CheckCircle size={16} />
              OCR Complete
            </span>

          </div>

          <div className="space-y-4">

            {Object.entries(extractedData).map(([key, value]) => (

              <div
                key={key}
                className="flex justify-between border-b border-slate-800 pb-3"
              >

                <span className="text-slate-500 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>

                <span className="text-white font-medium">
                  {value}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      <div className="flex justify-end">

        <button
          onClick={() =>
            navigate("/screening/DEMO-001/verification")
          }
          className="bg-cyan-500 text-slate-950 px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          Continue Verification
          <ArrowRight size={18} />
        </button>

      </div>

    </div>
  );
}