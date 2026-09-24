import { useState } from "react";
import axios from "axios";

import {
  ScanSearch,
  ArrowRight,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";

export default function DocumentUpload() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Document
  const [documentFile, setDocumentFile] = useState(null);
  const [documentType, setDocumentType] = useState("passport");

  // Person image
  const [personImage, setPersonImage] = useState(null);

  // Select document
  const setFile = (file) => {
    setDocumentFile(file);
  };

  // Remove document
  const removeFile = () => {
    setDocumentFile(null);
  };

  // Select person image
  const setPersonImageFile = (file) => {
    setPersonImage(file);
  };

  // Remove person image
  const removePersonImage = () => {
    setPersonImage(null);
  };

  // Start AI screening
  const startScreening = async () => {
    // Check document
    if (!documentFile) {
      alert("Please upload an identity document.");
      return;
    }

    // JWT token
    const token = localStorage.getItem("pramaanai_token");

    if (!token) {
      alert("Your session has expired. Please login again.");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    const selectedDocumentType = (
      documentType || "passport"
    ).trim();

    try {
      setLoading(true);

      // FormData
      const formData = new FormData();

      // Existing document upload
      formData.append("image", documentFile);

      formData.append(
        "documentType",
        selectedDocumentType
      );

      // Person image is currently frontend-only.
      // Existing /ocr backend is not changed.
      if (personImage) {
        console.log(
          "Person image selected:",
          personImage.name
        );
      }

      console.log(
        "Sending document:",
        documentFile.name
      );

      console.log(
        "Document type:",
        selectedDocumentType
      );

      console.log(
        "Person image:",
        personImage?.name || "Not uploaded"
      );

      // Send OCR request
      const response = await axios.post(
        "https://hackathon-backend-0eoj.onrender.com/ocr",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "OCR Backend Response:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.msg ||
          "OCR processing failed."
        );
      }

      // Save OCR result
      localStorage.setItem(
        "ocrResult",
        JSON.stringify(response.data || {})
      );

      localStorage.setItem(
        "documentName",
        documentFile.name
      );

      localStorage.setItem(
        "documentType",
        selectedDocumentType
      );

      if (personImage) {
        localStorage.setItem(
          "personImageName",
          personImage.name
        );
      }

      // Navigate
      navigate("/screening/DEMO-001/ocr");

    } catch (error) {
      console.error(
        "OCR API Error:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem(
          "pramaanai_token"
        );

        localStorage.removeItem(
          "ocrResult"
        );

        localStorage.removeItem(
          "documentName"
        );

        localStorage.removeItem(
          "documentType"
        );

        localStorage.removeItem(
          "personImageName"
        );

        alert(
          "Your session has expired. Please login again."
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      const backendMessage =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        error.response?.data?.error;

      alert(
        backendMessage ||
        error.message ||
        "Unable to connect to OCR backend."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1250px] mx-auto">

      {/* HEADER */}
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
            Upload an identity document and person's image
            for AI-assisted verification.
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


      {/* UPLOAD COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* DOCUMENT COLUMN */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">

          <h2 className="text-lg font-semibold text-slate-800">
            Upload Document
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Upload passport, visa, ID card or other identity document.
          </p>

          {/* SELECT DOCUMENT TYPE */}
          <div className="mt-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Document
            </label>

            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full h-11 border border-slate-300 rounded-lg px-3 text-sm outline-none focus:border-[#1677b8] bg-white"
            >
              <option value="passport">Passport</option>
              <option value="aadhaar">Aadhaar</option>
              <option value="pan">PAN Card</option>
              <option value="driving_license">Driving License</option>
              <option value="voter_id">Voter ID</option>
              <option value="residence_permit">Residence Permit</option>
              <option value="other">Other</option>
            </select>

          </div>

          {/* UPLOAD IDENTITY DOCUMENT */}
          <div className="mt-6">

            <FileUpload
              title="Upload Identity Document"
              description="PDF, JPG, JPEG or PNG"
              accept=".pdf,.jpg,.jpeg,.png"
              file={documentFile}
              onFileSelect={setFile}
              onRemove={removeFile}
            />

          </div>

        </div>
        {/* PERSON IMAGE COLUMN */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">

          <h2 className="text-lg font-semibold text-slate-800">
            Upload Your Image
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Upload a clear image of the person for
            identity verification.
          </p>


          {/* PERSON IMAGE UPLOAD */}
          <div className="mt-5">

            <FileUpload
              title="Upload Person Image"
              description="PNG, JPG or JPEG"
              accept=".jpg,.jpeg,.png"
              file={personImage}
              onFileSelect={setPersonImageFile}
              onRemove={removePersonImage}
            />

          </div>


          {/* INFORMATION */}
          <div className="mt-5 flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">

            <UserRound
              size={18}
              className="text-[#1677b8] mt-0.5"
            />

            <div>

              <p className="text-xs font-medium text-slate-700">
                Person Image
              </p>

              <p className="text-xs text-slate-400 mt-0.5">
                Use a clear front-facing image for
                better identity matching.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ACTION SECTION */}
      <div className="mt-7 bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center gap-4">

        <div>

          <p className="text-sm font-semibold text-[#17212b]">
            Ready to begin screening?
          </p>

          <p className="text-xs text-slate-500 mt-1">
            The uploaded document will be processed
            by the verification pipeline.
          </p>

        </div>


        {/* START SCREENING */}
        <button
          onClick={startScreening}
          disabled={loading}
          className="px-6 py-3 bg-[#1677b8] hover:bg-[#12679f] disabled:bg-slate-400 text-white rounded-md text-sm font-semibold flex items-center gap-2"
        >

          {loading
            ? "Processing..."
            : "Start AI Screening"}

          {!loading && (
            <ArrowRight size={17} />
          )}

        </button>

      </div>

    </div>
  );
}
