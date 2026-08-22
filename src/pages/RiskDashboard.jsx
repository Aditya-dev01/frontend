import { AlertTriangle } from "lucide-react";

export default function RiskDashboard() {

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-white">
          Risk Analysis
        </h1>

        <p className="text-slate-400 mt-1">
          AI-generated risk assessment
        </p>
      </div>

      {/* Score */}

      <div className="grid md:grid-cols-3 gap-5">

        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-7">

          <p className="text-slate-400">
            Overall Risk Score
          </p>

          <div className="flex items-center gap-6 mt-4">

            <div className="relative w-40 h-40 rounded-full border-[14px] border-red-500 flex items-center justify-center">

              <div className="text-center">

                <p className="text-4xl font-bold text-white">
                  82
                </p>

                <p className="text-xs text-slate-500">
                  / 100
                </p>

              </div>

            </div>

            <div>

              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  🔴
                </span>

                <span className="text-red-400 text-xl font-bold">
                  HIGH RISK
                </span>
              </div>

              <p className="text-slate-400 text-sm mt-3">
                Manual investigation recommended.
              </p>

            </div>

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-7">

          <h3 className="text-white font-semibold">
            Risk Distribution
          </h3>

          <div className="space-y-5 mt-6">

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-green-400">
                  Low
                </span>
                <span className="text-white">
                  20%
                </span>
              </div>

              <div className="h-2 bg-slate-800 rounded-full mt-2">
                <div className="h-full w-[20%] bg-green-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-yellow-400">
                  Medium
                </span>
                <span className="text-white">
                  30%
                </span>
              </div>

              <div className="h-2 bg-slate-800 rounded-full mt-2">
                <div className="h-full w-[30%] bg-yellow-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-red-400">
                  High
                </span>
                <span className="text-white">
                  82%
                </span>
              </div>

              <div className="h-2 bg-slate-800 rounded-full mt-2">
                <div className="h-full w-[82%] bg-red-500 rounded-full" />
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Reasons */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

        <div className="flex items-center gap-3 mb-5">

          <AlertTriangle className="text-red-400" />

          <h2 className="text-lg font-semibold text-white">
            AI Risk Factors
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-4">

          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-5">

            <h3 className="text-red-400 font-semibold">
              Photo Manipulation
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              AI detected unusual image patterns.
            </p>

          </div>

          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-5">

            <h3 className="text-yellow-400 font-semibold">
              Data Mismatch
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              Passport number differs from expected record.
            </p>

          </div>

          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-5">

            <h3 className="text-yellow-400 font-semibold">
              Face Similarity
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              Face similarity is below the configured threshold.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}