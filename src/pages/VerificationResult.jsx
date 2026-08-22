import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ScanFace,
  FileCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const checks = [
  {
    name: "OCR Extraction",
    status: "PASS",
    description: "Identity information successfully extracted",
    icon: FileCheck,
  },

  {
    name: "Document Validation",
    status: "PASS",
    description: "Document structure and metadata appear valid",
    icon: ShieldCheck,
  },

  {
    name: "Tampering Detection",
    status: "SUSPICIOUS",
    description: "Possible image manipulation detected",
    icon: AlertTriangle,
  },

  {
    name: "Face Verification",
    status: "PASS",
    description: "Face similarity: 96%",
    icon: ScanFace,
  },

  {
    name: "Blacklist Check",
    status: "CLEAR",
    description: "No matching record detected",
    icon: ShieldCheck,
  },
];

function StatusIcon({ status }) {

  if (status === "PASS" || status === "CLEAR") {
    return <CheckCircle className="text-green-400" />;
  }

  if (status === "SUSPICIOUS") {
    return <AlertTriangle className="text-yellow-400" />;
  }

  return <XCircle className="text-red-400" />;
}

export default function VerificationResult() {

  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div>

        <h1 className="text-2xl font-bold text-white">
          AI Verification Result
        </h1>

        <p className="text-slate-400 mt-1">
          Multi-layer identity and document analysis
        </p>

      </div>

      {/* Risk Banner */}

      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-red-400 text-sm font-semibold">
              OVERALL RISK
            </p>

            <h2 className="text-4xl font-bold text-white mt-2">
              HIGH
            </h2>

            <p className="text-slate-400 mt-1">
              Risk Score: 82 / 100
            </p>

          </div>

          <div className="text-6xl">
            🔴
          </div>

        </div>

      </div>

      {/* Checks */}

      <div className="space-y-3">

        {checks.map((check) => {

          const Icon = check.icon;

          return (
            <div
              key={check.name}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4"
            >

              <div className="p-3 bg-slate-800 rounded-lg">
                <Icon
                  size={22}
                  className={
                    check.status === "SUSPICIOUS"
                      ? "text-yellow-400"
                      : "text-cyan-400"
                  }
                />
              </div>

              <div className="flex-1">

                <h3 className="text-white font-semibold">
                  {check.name}
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  {check.description}
                </p>

              </div>

              <div className="flex items-center gap-2">

                <StatusIcon status={check.status} />

                <span
                  className={
                    check.status === "SUSPICIOUS"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }
                >
                  {check.status}
                </span>

              </div>

            </div>
          );
        })}

      </div>

      {/* Reasons */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

        <h2 className="text-white font-semibold mb-4">
          Risk Factors
        </h2>

        <div className="space-y-3">

          <div className="flex gap-3 text-red-400">
            <span>•</span>
            <span>Possible photo manipulation</span>
          </div>

          <div className="flex gap-3 text-yellow-400">
            <span>•</span>
            <span>Passport number mismatch</span>
          </div>

          <div className="flex gap-3 text-yellow-400">
            <span>•</span>
            <span>Face similarity below configured threshold</span>
          </div>

        </div>

      </div>

      <div className="flex justify-end">

        <button
          onClick={() => navigate("/risk-dashboard")}
          className="bg-cyan-500 text-slate-950 px-6 py-3 rounded-lg font-semibold"
        >
          View Risk Analysis
        </button>

      </div>

    </div>
  );
}