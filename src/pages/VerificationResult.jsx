import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ScanSearch,
  ArrowLeft,
  RefreshCw,
  MapPin,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";


export default function VerificationResult() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ============================================================
  // LOAD VERIFICATION RESULT
  // ============================================================

  useEffect(() => {

    const loadResult = () => {

      try {

        setLoading(true);
        setError("");


        // --------------------------------------------------------
        // GET JWT
        // --------------------------------------------------------

        const token =
          localStorage.getItem("pramaanai_token");


        if (!token) {

          navigate("/login", {
            replace: true,
          });

          return;
        }


        // --------------------------------------------------------
        // GET OCR / AI RESULT
        // --------------------------------------------------------

        const savedResult =
          localStorage.getItem("ocrResult");


        if (!savedResult) {

          setError(
            "No verification result was found. Please upload the document again."
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
            "Document verification failed."
          );

          return;
        }


        // --------------------------------------------------------
        // BACKEND RESPONSE
        //
        // details:
        // {
        //   anomaly_score: 0.3038,
        //   is_tampered: false,
        //   message: "...",
        //   suspicious_regions: [...]
        // }
        // --------------------------------------------------------

        const details =
          parsedResult.details || {};


        setVerificationData(details);

      } catch (err) {

        console.error(
          "Verification result error:",
          err
        );

        setError(
          "Unable to load verification results."
        );

      } finally {

        setLoading(false);

      }

    };


    loadResult();

  }, [navigate]);


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[450px]">

        <div className="text-center">

          <RefreshCw
            size={42}
            className="mx-auto text-cyan-400 animate-spin"
          />

          <p className="text-slate-400 mt-4">
            Analyzing verification result...
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

        <div className="bg-slate-900 border border-red-500/30 rounded-xl p-8 text-center">

          <XCircle
            size={50}
            className="mx-auto text-red-400"
          />

          <h2 className="text-white text-xl font-semibold mt-4">
            Verification Result Unavailable
          </h2>

          <p className="text-slate-400 mt-2">
            {error}
          </p>

          <button
            onClick={() => navigate("/screening/new")}
            className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-lg font-semibold transition"
          >
            Upload Document Again
          </button>

        </div>

      </div>

    );

  }


  // ============================================================
  // DATA
  // ============================================================

  const anomalyScore =
    Number(
      verificationData?.anomaly_score ?? 0
    );


  const isTampered =
    verificationData?.is_tampered === true;


  const message =
    verificationData?.message ||
    "No verification message available.";


  const suspiciousRegions =
    Array.isArray(
      verificationData?.suspicious_regions
    )
      ? verificationData.suspicious_regions
      : [];


  /*
   * Convert anomaly score to percentage.
   *
   * Example:
   * 0.3038 -> 30.38%
   */

  const anomalyPercentage =
    Math.round(
      anomalyScore * 10000
    ) / 100;


  // ============================================================
  // RISK
  // ============================================================

  let riskLevel;
  let riskColor;
  let riskDescription;

  if (isTampered) {

    riskLevel = "HIGH";
    riskColor = "red";

    riskDescription =
      "The AI model detected possible document tampering.";

  } else {

    riskLevel = "LOW";
    riskColor = "green";

    riskDescription =
      "The AI model did not detect document tampering.";

  }


  // ============================================================
  // STATUS ICON
  // ============================================================

  const StatusIcon = isTampered
    ? AlertTriangle
    : CheckCircle;


  return (

    <div className="max-w-5xl mx-auto space-y-6">


      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">

            <ScanSearch size={14} />

            SCREENING / VERIFICATION

          </div>


          <h1 className="text-2xl font-bold text-white">

            AI Verification Result

          </h1>


          <p className="text-slate-400 mt-1">

            AI-powered document tampering analysis

          </p>

        </div>


        <div className="flex items-center gap-2 text-sm text-slate-400">

          <ShieldCheck
            size={18}
            className="text-cyan-400"
          />

          AI Analysis Complete

        </div>

      </div>



      {/* ======================================================
          MAIN RESULT
      ======================================================= */}

      <div
        className={
          isTampered
            ? "bg-red-500/10 border border-red-500/30 rounded-2xl p-7"
            : "bg-green-500/10 border border-green-500/30 rounded-2xl p-7"
        }
      >

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">


          {/* Status */}

          <div className="flex items-center gap-5">

            <div
              className={
                isTampered
                  ? "w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center"
                  : "w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center"
              }
            >

              <StatusIcon
                size={34}
                className={
                  isTampered
                    ? "text-red-400"
                    : "text-green-400"
                }
              />

            </div>


            <div>

              <p
                className={
                  isTampered
                    ? "text-red-400 text-sm font-semibold uppercase tracking-wide"
                    : "text-green-400 text-sm font-semibold uppercase tracking-wide"
                }
              >
                Tampering Status
              </p>


              <h2 className="text-3xl md:text-4xl font-bold text-white mt-1">

                {isTampered
                  ? "TAMPERING DETECTED"
                  : "NO TAMPERING DETECTED"}

              </h2>


              <p className="text-slate-400 mt-2">

                {riskDescription}

              </p>

            </div>

          </div>


          {/* Risk */}

          <div className="text-center md:text-right">

            <p className="text-slate-500 text-xs uppercase tracking-wide">

              Overall Risk

            </p>

            <p
              className={
                isTampered
                  ? "text-3xl font-bold text-red-400 mt-1"
                  : "text-3xl font-bold text-green-400 mt-1"
              }
            >

              {riskLevel}

            </p>

          </div>

        </div>

      </div>



      {/* ======================================================
          SCORE CARDS
      ======================================================= */}

      <div className="grid md:grid-cols-3 gap-4">


        {/* Anomaly Score */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-slate-500 text-sm">
            Anomaly Score
          </p>

          <p className="text-white text-3xl font-bold mt-2">

            {anomalyScore.toFixed(4)}

          </p>

          <p className="text-slate-500 text-xs mt-2">

            Model anomaly measurement

          </p>

        </div>


        {/* Percentage */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-slate-500 text-sm">
            Anomaly Level
          </p>

          <p className="text-white text-3xl font-bold mt-2">

            {anomalyPercentage}%

          </p>

          <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">

            <div
              className={
                isTampered
                  ? "h-full bg-red-400 rounded-full transition-all"
                  : "h-full bg-green-400 rounded-full transition-all"
              }
              style={{
                width: `${Math.min(
                  anomalyPercentage,
                  100
                )}%`,
              }}
            />

          </div>

        </div>


        {/* Suspicious Regions */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-slate-500 text-sm">
            Suspicious Regions
          </p>

          <p className="text-white text-3xl font-bold mt-2">

            {suspiciousRegions.length}

          </p>

          <p className="text-slate-500 text-xs mt-2">

            Regions identified by the model

          </p>

        </div>

      </div>



      {/* ======================================================
          MODEL MESSAGE
      ======================================================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

        <div className="flex items-start gap-4">

          <div
            className={
              isTampered
                ? "p-3 bg-red-500/10 rounded-lg"
                : "p-3 bg-green-500/10 rounded-lg"
            }
          >

            {isTampered ? (

              <AlertTriangle
                size={22}
                className="text-red-400"
              />

            ) : (

              <CheckCircle
                size={22}
                className="text-green-400"
              />

            )}

          </div>


          <div>

            <h2 className="text-white font-semibold">
              AI Analysis
            </h2>

            <p className="text-slate-400 mt-2">
              {message}
            </p>

          </div>

        </div>

      </div>



      {/* ======================================================
          SUSPICIOUS REGIONS
      ======================================================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-white font-semibold">
              Suspicious Regions
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Areas identified during anomaly analysis
            </p>

          </div>

          <span className="text-xs text-slate-500">

            {suspiciousRegions.length} region
            {suspiciousRegions.length !== 1 ? "s" : ""}

          </span>

        </div>


        {suspiciousRegions.length === 0 ? (

          <div className="border border-green-500/20 bg-green-500/5 rounded-lg p-6 text-center">

            <CheckCircle
              size={32}
              className="mx-auto text-green-400"
            />

            <p className="text-green-400 font-semibold mt-3">

              No suspicious regions detected

            </p>

          </div>

        ) : (

          <div className="space-y-3">

            {suspiciousRegions.map(
              (region, index) => (

                <div
                  key={index}
                  className="border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition"
                >

                  <div className="flex items-center justify-between mb-3">

                    <div className="flex items-center gap-2">

                      <MapPin
                        size={16}
                        className="text-yellow-400"
                      />

                      <span className="text-white font-medium">

                        Region {index + 1}

                      </span>

                    </div>


                    <span className="text-yellow-400 text-sm font-semibold">

                      Intensity {region.intensity}

                    </span>

                  </div>


                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                    <div>

                      <p className="text-xs text-slate-500">
                        X
                      </p>

                      <p className="text-white font-medium">
                        {region.x}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Y
                      </p>

                      <p className="text-white font-medium">
                        {region.y}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Width
                      </p>

                      <p className="text-white font-medium">
                        {region.w}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Height
                      </p>

                      <p className="text-white font-medium">
                        {region.h}
                      </p>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>



      {/* ======================================================
          VERIFICATION CHECKS
      ======================================================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

        <h2 className="text-white font-semibold mb-5">
          Verification Checks
        </h2>


        <div className="space-y-3">


          {/* OCR */}

          <div className="flex items-center gap-4 border-b border-slate-800 pb-4">

            <div className="p-2 bg-green-500/10 rounded-lg">

              <CheckCircle
                size={20}
                className="text-green-400"
              />

            </div>

            <div className="flex-1">

              <p className="text-white font-medium">
                AI Document Processing
              </p>

              <p className="text-slate-500 text-sm">
                Document successfully processed by the AI pipeline.
              </p>

            </div>

            <span className="text-green-400 text-sm font-semibold">
              PASS
            </span>

          </div>


          {/* Tampering */}

          <div className="flex items-center gap-4">

            <div
              className={
                isTampered
                  ? "p-2 bg-red-500/10 rounded-lg"
                  : "p-2 bg-green-500/10 rounded-lg"
              }
            >

              {isTampered ? (

                <AlertTriangle
                  size={20}
                  className="text-red-400"
                />

              ) : (

                <CheckCircle
                  size={20}
                  className="text-green-400"
                />

              )}

            </div>


            <div className="flex-1">

              <p className="text-white font-medium">
                Tampering Detection
              </p>

              <p className="text-slate-500 text-sm">
                {isTampered
                  ? "Possible manipulation detected."
                  : "No tampering detected by the AI model."}
              </p>

            </div>


            <span
              className={
                isTampered
                  ? "text-red-400 text-sm font-semibold"
                  : "text-green-400 text-sm font-semibold"
              }
            >

              {isTampered
                ? "SUSPICIOUS"
                : "PASS"}

            </span>

          </div>

        </div>

      </div>



      {/* ======================================================
          ACTIONS
      ======================================================= */}

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">


        <button
          onClick={() =>
            navigate("/screening/new")
          }
          className="border border-slate-700 hover:border-slate-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
        >

          <ArrowLeft size={18} />

          New Screening

        </button>


        <button
          onClick={() =>
            navigate("/risk-dashboard")
          }
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-lg font-semibold transition"
        >

          View Risk Analysis

        </button>

      </div>

    </div>

  );
}
