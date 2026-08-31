import {
  CheckCircle,
  FileText,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";


export default function OCRResults() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [ocrData, setOcrData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ============================================================
  // LOAD OCR RESULT
  // ============================================================

  useEffect(() => {

    const loadOCRResult = async () => {

      try {

        setLoading(true);
        setError("");


        // --------------------------------------------------------
        // GET JWT FROM LOCAL STORAGE
        // --------------------------------------------------------

        const token = localStorage.getItem("pramaanai_token");


        if (!token) {

          navigate("/login", {
            replace: true,
          });

          return;

        }


        // --------------------------------------------------------
        // GET SAVED OCR RESULT
        // --------------------------------------------------------
        //
        // The /ocr request itself should normally be made by
        // DocumentUpload.jsx because it contains the image.
        //
        // After /ocr succeeds, DocumentUpload saves the response
        // in localStorage.
        //
        // --------------------------------------------------------

        const savedResult =
          localStorage.getItem("ocrResult");


        if (!savedResult) {

          setError(
            "No OCR result was found. Please upload the document again."
          );

          return;

        }


        const parsedResult =
          JSON.parse(savedResult);


        // --------------------------------------------------------
        // CHECK BACKEND RESPONSE
        // --------------------------------------------------------

        if (!parsedResult.success) {

          setError(
            parsedResult.msg ||
            "OCR processing failed."
          );

          return;

        }


        setOcrData(
          parsedResult
        );


      } catch (err) {

        console.error(
          "OCR result error:",
          err
        );

        setError(
          "Unable to load OCR results."
        );

      } finally {

        setLoading(false);

      }

    };


    loadOCRResult();

  }, [navigate]);


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[400px]">

        <div className="text-center">

          <Loader2
            size={40}
            className="mx-auto text-cyan-400 animate-spin"
          />

          <p className="text-slate-400 mt-4">
            Loading OCR results...
          </p>

        </div>

      </div>

    );

  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error) {

    return (

      <div className="max-w-5xl mx-auto">

        <div className="bg-slate-900 border border-red-900 rounded-xl p-8 text-center">

          <AlertCircle
            size={45}
            className="mx-auto text-red-400"
          />

          <h2 className="text-white text-xl font-semibold mt-4">
            OCR Result Unavailable
          </h2>

          <p className="text-slate-400 mt-2">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/screening/new")
            }
            className="mt-6 bg-cyan-500 text-slate-950 px-6 py-3 rounded-lg font-semibold"
          >
            Upload Document Again
          </button>

        </div>

      </div>

    );

  }


  // ============================================================
  // GET MODEL RESULT
  // ============================================================

  const result =
    ocrData?.details?.result || {};


  // ------------------------------------------------------------
  // Handle different possible AI response structures.
  // ------------------------------------------------------------

  const extractedData =
    result.extracted_data ||
    result.extractedData ||
    result.ocr ||
    result.ocr_data ||
    {};


  // ============================================================
  // FORMAT LABEL
  // ============================================================

  const formatLabel = (key) => {

    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

  };


  // ============================================================
  // DISPLAY VALUE
  // ============================================================

  const formatValue = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return "Not available";

    }


    if (
      typeof value === "object"
    ) {

      return JSON.stringify(
        value,
        null,
        2
      );

    }


    return String(value);

  };


  // ============================================================
  // OCR RESULTS
  // ============================================================

  return (

    <div className="max-w-5xl mx-auto space-y-6">


      {/* ======================================================
          HEADER
      ======================================================= */}

      <div>

        <h1 className="text-2xl font-bold text-white">
          OCR Extraction Results
        </h1>

        <p className="text-slate-400 mt-1">
          Information extracted from the uploaded document
        </p>

      </div>


      {/* ======================================================
          RESULT GRID
      ======================================================= */}

      <div className="grid lg:grid-cols-2 gap-6">


        {/* ====================================================
            DOCUMENT PREVIEW
        ===================================================== */}

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
                Uploaded Document
              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            OCR DATA
        ===================================================== */}

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


          {/* ==================================================
              NO EXTRACTED DATA
          =================================================== */}

          {Object.keys(extractedData).length === 0 ? (

            <div className="py-10 text-center">

              <FileText
                size={40}
                className="mx-auto text-slate-600"
              />

              <p className="text-slate-400 mt-3">
                No structured OCR fields were returned.
              </p>

              <p className="text-xs text-slate-500 mt-2">
                The document was processed successfully,
                but the AI response did not contain
                structured extraction fields.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {Object.entries(
                extractedData
              ).map(([key, value]) => (

                <div
                  key={key}
                  className="flex justify-between gap-6 border-b border-slate-800 pb-3"
                >

                  <span className="text-slate-500 capitalize">

                    {formatLabel(key)}

                  </span>


                  <span className="text-white font-medium text-right break-words">

                    {formatValue(value)}

                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>


      {/* ======================================================
          RAW RESULT / STATUS
      ======================================================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

        <div className="flex items-center gap-2">

          <CheckCircle
            size={18}
            className="text-green-400"
          />

          <span className="text-white font-semibold">
            Document processed successfully
          </span>

        </div>


        {ocrData?.details?.document_id && (

          <p className="text-xs text-slate-500 mt-2">

            Document ID:{" "}

            <span className="text-slate-400">
              {ocrData.details.document_id}
            </span>

          </p>

        )}

      </div>


      {/* ======================================================
          CONTINUE
      ======================================================= */}

      <div className="flex justify-end">

        <button
          onClick={() => {

            const documentId =
              ocrData?.details?.document_id ||
              id;


            if (!documentId) {

              setError(
                "Document ID is missing. Please upload the document again."
              );

              return;

            }


            navigate(
              `/screening/${documentId}/verification`
            );

          }}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
        >

          Continue Verification

          <ArrowRight size={18} />

        </button>

      </div>

    </div>

  );

}