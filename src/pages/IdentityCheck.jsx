import { useState } from "react";

import {
  ShieldCheck,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

export default function IdentityCheck() {

  const [documentType, setDocumentType] =
    useState("passport");

  const [file, setFile] =
    useState(null);

  const [status, setStatus] =
    useState("idle");

  const [message, setMessage] =
    useState("");

  const handleFile = (selectedFile) => {

    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {
      setStatus("error");

      setMessage(
        "Please upload a JPG, PNG or PDF document."
      );

      return;
    }

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {
      setStatus("error");

      setMessage(
        "File size must be less than 10 MB."
      );

      return;
    }

    setFile(selectedFile);
    setStatus("idle");
    setMessage("");
  };

  const verifyDocument = async () => {

    if (!file) {

      setStatus("error");

      setMessage(
        "Please upload an identity document first."
      );

      return;
    }

    setStatus("processing");
    setMessage("");

    await new Promise((resolve) =>
      setTimeout(resolve, 1800)
    );

    /*
     * DEMO VERIFICATION
     *
     * Later connect this to your existing
     * OCR / verification backend.
     */

    setStatus("success");

    setMessage(
      "Your document has been submitted successfully for identity verification."
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

        <Link
          to="/user-dashboard"
          className="flex items-center gap-3"
        >

          <div className="w-9 h-9 bg-[#1677b8] rounded-lg flex items-center justify-center text-white">

            <ShieldCheck size={20} />

          </div>

          <div>

            <h1 className="font-bold text-slate-800">
              PramaanAI
            </h1>

            <p className="text-[9px] tracking-widest text-slate-400">
              IDENTITY VERIFICATION
            </p>

          </div>

        </Link>

        <Link
          to="/user-dashboard"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
        >

          <ArrowLeft size={16} />

          Dashboard

        </Link>

      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10">

        <div className="mb-8">

          <p className="text-xs font-bold tracking-[1.5px] text-[#1677b8]">
            IDENTITY VERIFICATION
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            Check your identity
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Upload your identity document to begin
            the verification process.
          </p>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          {/* DOCUMENT TYPE */}

          <label className="text-xs font-bold text-slate-600">
            DOCUMENT TYPE
          </label>

          <select
            value={documentType}
            onChange={(e) =>
              setDocumentType(e.target.value)
            }
            className="mt-2 w-full h-11 border border-slate-300 rounded-lg px-3 text-sm outline-none focus:border-[#1677b8]"
          >

            <option value="passport">
              Passport
            </option>

            <option value="national-id">
              National Identity Card
            </option>

            <option value="driving-license">
              Driving License
            </option>

            <option value="other">
              Other Identity Document
            </option>

          </select>

          {/* UPLOAD */}

          <div className="mt-7">

            <label className="text-xs font-bold text-slate-600">
              IDENTITY DOCUMENT
            </label>

            <div className="mt-2 border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center bg-slate-50">

              {file ? (

                <div className="flex flex-col items-center">

                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

                    <FileText
                      size={27}
                      className="text-[#1677b8]"
                    />

                  </div>

                  <p className="font-semibold text-slate-700 mt-4">
                    {file.name}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)}
                    {" "}MB
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setFile(null)
                    }
                    className="mt-4 text-xs font-semibold text-red-500 hover:underline"
                  >
                    Remove document
                  </button>

                </div>

              ) : (

                <>

                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mx-auto">

                    <UploadCloud
                      size={28}
                      className="text-[#1677b8]"
                    />

                  </div>

                  <h3 className="font-semibold text-slate-700 mt-4">
                    Upload identity document
                  </h3>

                  <p className="text-sm text-slate-400 mt-2">
                    JPG, PNG or PDF
                  </p>

                  <label className="inline-flex items-center justify-center mt-5 px-5 h-10 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">

                    Browse files

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleFile(
                          e.target.files?.[0]
                        )
                      }
                    />

                  </label>

                </>

              )}

            </div>

          </div>

          {/* ERROR */}

          {status === "error" && (

            <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3">

              <AlertCircle
                size={20}
                className="text-red-500 shrink-0"
              />

              <p className="text-sm text-red-700">
                {message}
              </p>

            </div>

          )}

          {/* SUCCESS */}

          {status === "success" && (

            <div className="mt-5 p-5 rounded-xl bg-emerald-50 border border-emerald-200 flex gap-3">

              <CheckCircle2
                size={22}
                className="text-emerald-600 shrink-0"
              />

              <div>

                <h3 className="font-bold text-emerald-800">
                  Verification submitted
                </h3>

                <p className="text-sm text-emerald-700 mt-1">
                  {message}
                </p>

              </div>

            </div>

          )}

          {/* BUTTON */}

          <button
            onClick={verifyDocument}
            disabled={
              status === "processing"
            }
            className="mt-7 w-full h-12 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >

            {status === "processing" ? (

              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Processing document...
              </>

            ) : (

              <>
                Start Identity Verification

                <ArrowLeft
                  size={17}
                  className="rotate-180"
                />

              </>

            )}

          </button>

        </div>

      </main>

    </div>
  );
}