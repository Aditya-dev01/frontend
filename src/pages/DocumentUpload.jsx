import { useState } from "react";
import axios from "axios";

import {
  ScanSearch,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";

export default function DocumentUpload() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentType, setDocumentType] = useState("passport");

  // Select document
  const setFile = (file) => {
    setDocumentFile(file);
  };

  // Remove document
  const removeFile = () => {
    setDocumentFile(null);
  };

  // Start AI screening
  const startScreening = async () => {
    // ---------------------------------------------
    // 1. Check document
    // ---------------------------------------------
    if (!documentFile) {
      alert("Please upload an identity document.");
      return;
    }

    // ---------------------------------------------
    // 2. Get JWT token from localStorage
    // ---------------------------------------------
    const token = localStorage.getItem("pramaanai_token");

    if (!token) {
      alert("Your session has expired. Please login again.");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    const selectedDocumentType = (documentType || "passport").trim();

    try {
      setLoading(true);

      // ---------------------------------------------
      // 3. Create FormData
      // ---------------------------------------------
      const formData = new FormData();

      // Backend /ocr expects:
      // request.files["image"]
      formData.append("image", documentFile);
      formData.append("documentType", selectedDocumentType);

      console.log("Sending document:", documentFile.name);
      console.log("Document type:", selectedDocumentType);
      console.log("JWT token found:", !!token);

      // ---------------------------------------------
      // 4. Send POST /ocr
      // ---------------------------------------------
      const response = await axios.post(
          "https://hackathon-backend-0eoj.onrender.com/ocr",
          formData,
          {
            headers: {
              // JWT authorization
              Authorization: `Bearer ${token}`,

              // DO NOT manually set Content-Type here.
              // Axios automatically creates the correct
              // multipart/form-data boundary for FormData.
            },
          }
        );

        // ---------------------------------------------
        // 5. Backend response
        // ---------------------------------------------
        console.log("OCR Backend Response:", response.data);

        // ---------------------------------------------
        // 6. Check backend success
        // ---------------------------------------------
        if (!response.data?.success) {
          throw new Error(response.data?.msg || "OCR processing failed.");
        }

        // ---------------------------------------------
        // 7. Save OCR result, document name, and document type to localStorage
        // ---------------------------------------------
        localStorage.setItem("ocrResult", JSON.stringify(response.data || {}));
        localStorage.setItem("documentName", documentFile.name);
        localStorage.setItem("documentType", selectedDocumentType);

        // ---------------------------------------------
        // 8. Navigate to OCR results
        // ---------------------------------------------
        navigate("/screening/DEMO-001/ocr");
    } catch (error) {
        console.error("OCR API Error:", error);

        // ---------------------------------------------
        // JWT authentication error
        // ---------------------------------------------
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("ocrResult");
          localStorage.removeItem("documentName");
          localStorage.removeItem("documentType");

          alert("Your session has expired. Please login again.");
          navigate("/login", { replace: true });

          return;
        }

        // ---------------------------------------------
        // Backend error
        // ---------------------------------------------
        const backendMessage =
          error.response?.data?.msg ||
          error.response?.data?.message ||
          error.response?.data?.error;

        alert(backendMessage || error.message || "Unable to connect to OCR backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1250px] mx-auto">

      {/* -------------------------------------------
          Header
      -------------------------------------------- */}
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

            Upload one identity document for
            AI-assisted verification.

          </p>

        </div>

        {/* Secure Upload */}

        <div className="flex items-center gap-2 mt-4 md:mt-0 text-xs text-slate-500">

          <ShieldCheck
            size={16}
            className="text-green-600"
          />

          Secure upload channel

        </div>
      </div>


      {/* -------------------------------------------
          Document Upload
      -------------------------------------------- */}
      <div className="max-w-xl mx-auto mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
          Document Type
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

      <div className="max-w-xl mx-auto">
        <FileUpload
          title="Identity Document"
          description="Upload an identity document"
          accept="image/*,.pdf"
          file={documentFile}
          onFileSelect={setFile}
          onRemove={removeFile}
        />

      </div>


      {/* -------------------------------------------
          Action Section
      -------------------------------------------- */}

      <div className="mt-7 bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-sm font-semibold text-[#17212b]">
            Ready to begin screening?
          </p>

          <p className="text-xs text-slate-500 mt-1">
            The uploaded document will be processed by the verification pipeline.
          </p>
        </div>


        {/* Start Screening */}

        <button
          onClick={startScreening}
          disabled={loading}
          className="px-6 py-3 bg-[#1677b8] hover:bg-[#12679f] disabled:bg-slate-400 text-white rounded-md text-sm font-semibold flex items-center gap-2"
        >

          {loading ? "Processing..." : "Start AI Screening"}

          {!loading && <ArrowRight size={17} />}

        </button>
      </div>
    </div>
  );
}