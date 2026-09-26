import { useEffect, useState } from "react";
import axios from "axios";

export default function AuditHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAuditHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("pramaanai_token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.post(
        "https://hackathon-backend-0eoj.onrender.com/audit_logs",
        {
          limit: 5,
          offset: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Audit Logs Response:", response.data);

      const rows = response.data?.details?.rows;

      if (Array.isArray(rows)) {
        setHistory(rows);
      } else {
        setHistory([]);
        console.warn("Audit rows not found:", response.data);
      }
    } catch (err) {
      console.error("Audit history error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.response?.data?.error ||
        `Request failed with status code ${
          err.response?.status || "unknown"
        }`;

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditHistory();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRiskColor = (score) => {
    const riskScore = Number(score);

    if (riskScore >= 70) {
      return "text-red-400";
    }

    if (riskScore >= 40) {
      return "text-yellow-400";
    }

    return "text-green-400";
  };

  const getDecisionStyle = (decision) => {
    if (decision === "Verified") {
      return "bg-green-500/10 text-green-400";
    }

    if (decision === "Suspicious") {
      return "bg-yellow-500/10 text-yellow-400";
    }

    if (decision === "Rejected" || decision === "High Risk") {
      return "bg-red-500/10 text-red-400";
    }

    return "bg-slate-500/10 text-slate-400";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">
          Investigation & Audit History
        </h1>

        <p className="text-slate-500 mt-1">
          Previous document screening activities
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">
            Loading audit history...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="font-semibold text-red-600">
            Failed to load audit history
          </p>

          <p className="text-red-500 text-sm mt-1">
            {error}
          </p>

          <button
            onClick={fetchAuditHistory}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* No Data */}
      {!loading && !error && history.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">
            No audit history found.
          </p>
        </div>
      )}

      {/* Audit Table */}
      {!loading && !error && history.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950">
                <tr className="text-left text-slate-500 text-sm">
                  <th className="p-4">
                    Document Type
                  </th>

                  <th className="p-4">
                    Date / Time
                  </th>

                  <th className="p-4">
                    Risk Score
                  </th>

                  <th className="p-4">
                    Decision
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.log_id}
                    className="border-t border-slate-800 text-sm"
                  >
                    {/* Document Type */}
                    <td className="p-4 text-slate-300">
                      {item.document_type || "-"}
                    </td>

                    {/* Timestamp */}
                    <td className="p-4 text-slate-400">
                      {formatDate(item.timestamp)}
                    </td>

                    {/* Risk Score */}
                    <td className="p-4">
                      <span
                        className={getRiskColor(item.risk_score)}
                      >
                        {Number(item.risk_score ?? 0).toFixed(1)}
                        /100
                      </span>
                    </td>

                    {/* Decision */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getDecisionStyle(
                          item.decision
                        )}`}
                      >
                        {item.decision || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}