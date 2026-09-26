import {
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Activity,
  ArrowRight,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";

export default function Dashboard() {
  const navigate = useNavigate();

  // --------------------------------------------------
  // Dashboard State
  // --------------------------------------------------

  const [chartData, setChartData] = useState([]);

  const [decisionData, setDecisionData] = useState({
    verified: 0,
    rejected: 0,
    suspicious: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Format backend timestamp
  //
  // Backend:
  // "Sat, 26 Sep 2026 18:36:44 GMT"
  //
  // Chart:
  // "26 Sep"
  // --------------------------------------------------

  const formatChartDate = (timestamp) => {
    if (!timestamp) return "-";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return String(timestamp);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  // --------------------------------------------------
  // Format date for tooltip
  //
  // Backend:
  // "Sat, 26 Sep 2026 18:36:44 GMT"
  //
  // Tooltip:
  // "26 Sep 2026"
  // --------------------------------------------------

  const formatTooltipDate = (timestamp) => {
    if (!timestamp) return "-";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return String(timestamp);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // Get date key
  //
  // This is used to combine multiple audits
  // that happened on the same date.
  // --------------------------------------------------

  const getDateKey = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // --------------------------------------------------
  // Fetch Dashboard Data
  // --------------------------------------------------

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("pramaanai_token");

        if (!token) {
          setError(
            "Authentication token not found. Please login again."
          );
          setLoading(false);
          return;
        }

        const response = await axios.post(
          "https://hackathon-backend-0eoj.onrender.com/dashboard",
          {
            prev_day_count: 6,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Dashboard API Response:",
          response.data
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.msg ||
              response.data?.message ||
              "Could not fetch dashboard data."
          );
        }

        // --------------------------------------------------
        // Get backend details
        // --------------------------------------------------

        const details = response.data?.details || {};

        const dateData =
          details.audit_logs_by_date || [];

        const decisionResponse =
          details.audit_logs_by_decision || {};

        console.log(
          "Raw audit logs by date:",
          dateData
        );

        console.log(
          "Audit logs by decision:",
          decisionResponse
        );

        // --------------------------------------------------
        // Prepare graph data
        //
        // Backend:
        //
        // {
        //   "log_count": 1,
        //   "timestamp":
        //   "Sat, 26 Sep 2026 18:36:44 GMT"
        // }
        //
        // Frontend:
        //
        // {
        //   date: "26 Sep",
        //   audits: 1,
        //   timestamp: "Sat, 26 Sep 2026..."
        // }
        // --------------------------------------------------

        const groupedByDate = {};

        if (Array.isArray(dateData)) {
          dateData.forEach((item) => {
            if (!item) return;

            const timestamp = item.timestamp;

            if (!timestamp) return;

            const dateKey = getDateKey(timestamp);

            if (!dateKey) return;

            const auditCount = Number(
              item.log_count ?? 0
            );

            if (!groupedByDate[dateKey]) {
              groupedByDate[dateKey] = {
                timestamp,
                audits: 0,
              };
            }

            groupedByDate[dateKey].audits +=
              auditCount;
          });
        }

        // --------------------------------------------------
        // Convert grouped object to chart array
        // --------------------------------------------------

        const formattedChartData = Object.entries(
          groupedByDate
        )
          .sort(([dateA], [dateB]) =>
            dateA.localeCompare(dateB)
          )
          .map(([dateKey, value]) => ({
            date: formatChartDate(
              value.timestamp
            ),
            fullDate: value.timestamp,
            audits: value.audits,
            dateKey,
          }));

        console.log(
          "Final Chart Data:",
          formattedChartData
        );

        setChartData(formattedChartData);

        // --------------------------------------------------
        // Prepare decision data
        // --------------------------------------------------

        let verified = 0;
        let rejected = 0;
        let suspicious = 0;

        if (
          decisionResponse &&
          typeof decisionResponse === "object" &&
          !Array.isArray(decisionResponse)
        ) {
          verified = Number(
            decisionResponse.verified ??
              decisionResponse.Verified ??
              decisionResponse.VERIFIED ??
              0
          );

          rejected = Number(
            decisionResponse.rejected ??
              decisionResponse.Rejected ??
              decisionResponse.REJECTED ??
              0
          );

          suspicious = Number(
            decisionResponse.suspicious ??
              decisionResponse.Suspicious ??
              decisionResponse.SUSPICIOUS ??
              decisionResponse.review ??
              0
          );
        }

        // --------------------------------------------------
        // If backend returns decision array
        // --------------------------------------------------

        if (Array.isArray(decisionResponse)) {
          verified = 0;
          rejected = 0;
          suspicious = 0;

          decisionResponse.forEach((item) => {
            const decision = String(
              item.decision ??
                item.result ??
                item.label ??
                ""
            ).toLowerCase();

            const count = Number(
              item.count ??
                item.total ??
                item.value ??
                0
            );

            if (
              decision.includes("verified") ||
              decision.includes("approve")
            ) {
              verified += count;
            } else if (
              decision.includes("reject")
            ) {
              rejected += count;
            } else if (
              decision.includes("suspicious") ||
              decision.includes("review")
            ) {
              suspicious += count;
            }
          });
        }

        setDecisionData({
          verified,
          rejected,
          suspicious,
        });
      } catch (err) {
        console.error(
          "Dashboard API Error:",
          err
        );

        setError(
          err.response?.data?.msg ||
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --------------------------------------------------
  // Calculate totals
  // --------------------------------------------------

  const totalScreened =
    decisionData.verified +
    decisionData.rejected +
    decisionData.suspicious;

  const verifiedPercentage =
    totalScreened > 0
      ? Math.round(
          (decisionData.verified /
            totalScreened) *
            100
        )
      : 0;

  const rejectedPercentage =
    totalScreened > 0
      ? Math.round(
          (decisionData.rejected /
            totalScreened) *
            100
        )
      : 0;

  const suspiciousPercentage =
    totalScreened > 0
      ? Math.round(
          (decisionData.suspicious /
            totalScreened) *
            100
        )
      : 0;

  return (
    <div className="max-w-[1400px] mx-auto">

      {/* --------------------------------------------------
          Header
      -------------------------------------------------- */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-7">
        <div>
          <p className="text-xs text-slate-400 tracking-wide">
            OVERVIEW / SECURITY OPERATIONS
          </p>

          <h1 className="text-2xl font-bold text-[#17212b] mt-1">
            Screening Control Center
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Monitor identity verification activity and security risks.
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/screening/new")
          }
          className="mt-4 md:mt-0 bg-[#1677b8] text-white px-5 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2"
        >
          <Activity size={17} />
          New Screening
        </button>
      </div>

      {/* --------------------------------------------------
          Error
      -------------------------------------------------- */}

      {error && (
        <div className="mb-5 border border-red-200 bg-red-50 text-red-600 rounded-md px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* --------------------------------------------------
          Stats
      -------------------------------------------------- */}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Total Screened"
          value={
            loading
              ? "..."
              : totalScreened.toLocaleString()
          }
          description="Total screening activity"
          icon={FileCheck2}
        />

        <StatCard
          title="Verified"
          value={
            loading
              ? "..."
              : decisionData.verified.toLocaleString()
          }
          description={`${verifiedPercentage}% verification rate`}
          icon={ShieldCheck}
          variant="success"
        />

        <StatCard
          title="Rejected"
          value={
            loading
              ? "..."
              : decisionData.rejected.toLocaleString()
          }
          description={`${rejectedPercentage}% critical cases`}
          icon={ShieldAlert}
          variant="danger"
        />

        <StatCard
          title="Suspicious"
          value={
            loading
              ? "..."
              : decisionData.suspicious.toLocaleString()
          }
          description={`${suspiciousPercentage}% require review`}
          icon={AlertTriangle}
          variant="warning"
        />

      </div>

      {/* --------------------------------------------------
          Analytics
      -------------------------------------------------- */}

      <div className="grid xl:grid-cols-[2fr_1fr] gap-5 mt-5">

        {/* --------------------------------------------------
            Audit Activity Graph
        -------------------------------------------------- */}

        <div className="bg-white border border-slate-200 rounded-lg p-5">

          <div className="flex justify-between mb-5">
            <div>
              <h2 className="font-semibold text-[#17212b]">
                Audit Activity
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Number of audits performed by date
              </p>
            </div>

            <div className="text-xs text-slate-400">
              Last 6 days
            </div>
          </div>

          <div className="h-[280px]">

            {loading ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                Loading dashboard data...
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                No audit activity available.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 15,
                    left: 10,
                    bottom: 25,
                  }}
                >

                  <defs>
                    <linearGradient
                      id="auditGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#1677b8"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="100%"
                        stopColor="#1677b8"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  {/* X AXIS = DATE */}

                  <XAxis
                    dataKey="date"
                    type="category"
                    interval={0}
                    tick={{
                      fontSize: 11,
                      fill: "#64748b",
                      fontWeight: 400,
                    }}
                    axisLine={false}
                    tickLine={false}
                    height={55}
                    padding={{
                      left: 10,
                      right: 10,
                    }}
                    label={{
                      value: "Date",
                      position: "insideBottom",
                      offset: -5,
                      style: {
                        fontSize: 12,
                        fill: "#475569",
                        fontWeight: 400,
                      },
                    }}
                  />

                  {/* Y AXIS = LOG COUNT */}

                  <YAxis
                    dataKey="audits"
                    allowDecimals={false}
                    tick={{
                      fontSize: 11,
                      fill: "#64748b",
                      fontWeight: 400,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={55}
                    label={{
                      value: "No. of Audits",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        fontSize: 12,
                        fill: "#475569",
                        fontWeight: 400,
                        textAnchor: "middle",
                      },
                    }}
                  />

                  {/* TOOLTIP */}

                  <Tooltip
                    labelFormatter={(value, payload) => {
                      const timestamp =
                        payload?.[0]?.payload?.fullDate;

                      return formatTooltipDate(
                        timestamp || value
                      );
                    }}
                    formatter={(value) => [
                      value,
                      "Audits",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />

                  {/* AUDIT COUNT */}

                  <Area
                    type="monotone"
                    dataKey="audits"
                    stroke="#1677b8"
                    fill="url(#auditGradient)"
                    strokeWidth={2}
                    activeDot={{
                      r: 5,
                    }}
                  />

                </AreaChart>
              </ResponsiveContainer>
            )}

          </div>
        </div>

        {/* --------------------------------------------------
            Risk Summary
        -------------------------------------------------- */}

        <div className="bg-white border border-slate-200 rounded-lg p-5">

          <h2 className="font-semibold text-[#17212b]">
            Risk Distribution
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Current screening population
          </p>

          <div className="mt-7 space-y-6">

            <RiskRow
              label="Low Risk"
              value={
                loading
                  ? "..."
                  : decisionData.verified
              }
              percentage={
                loading
                  ? "0%"
                  : `${verifiedPercentage}%`
              }
              width={`${verifiedPercentage}%`}
              color="bg-green-500"
            />

            <RiskRow
              label="Rejected"
              value={
                loading
                  ? "..."
                  : decisionData.rejected
              }
              percentage={
                loading
                  ? "0%"
                  : `${rejectedPercentage}%`
              }
              width={`${rejectedPercentage}%`}
              color="bg-red-500"
            />

            <RiskRow
              label="Medium Risk"
              value={
                loading
                  ? "..."
                  : decisionData.suspicious
              }
              percentage={
                loading
                  ? "0%"
                  : `${suspiciousPercentage}%`
              }
              width={`${suspiciousPercentage}%`}
              color="bg-amber-500"
            />

          </div>

          <button
            onClick={() =>
              navigate("/risk-dashboard")
            }
            className="mt-8 w-full border border-slate-200 py-2.5 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            View Risk Analysis
            <ArrowRight size={14} />
          </button>

        </div>
      </div>

      {/* --------------------------------------------------
          Recent Cases
      -------------------------------------------------- */}

      <div className="bg-white border border-slate-200 rounded-lg mt-5">

        <div className="p-5 flex justify-between items-center border-b border-slate-100">

          <div>
            <h2 className="font-semibold text-[#17212b]">
              Recent Screenings
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Latest identity verification cases
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/audit-history")
            }
            className="text-xs text-[#1677b8] font-semibold"
          >
            View all
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>

                <th className="text-left px-5 py-3 font-semibold">
                  CASE ID
                </th>

                <th className="text-left px-5 py-3 font-semibold">
                  DOCUMENT
                </th>

                <th className="text-left px-5 py-3 font-semibold">
                  SUBJECT
                </th>

                <th className="text-left px-5 py-3 font-semibold">
                  RESULT
                </th>

                <th className="text-left px-5 py-3 font-semibold">
                  RISK
                </th>

                <th className="text-left px-5 py-3 font-semibold">
                  TIME
                </th>

              </tr>
            </thead>

            <tbody>

              <tr className="border-t border-slate-100 hover:bg-slate-50">

                <td className="px-5 py-4 font-mono text-xs text-slate-600">
                  IDG-2026-08124
                </td>

                <td className="px-5 py-4 text-slate-700">
                  Passport
                </td>

                <td className="px-5 py-4 text-slate-700">
                  Rahul Sharma
                </td>

                <td className="px-5 py-4 text-slate-600">
                  Verified
                </td>

                <td className="px-5 py-4">
                  <RiskBadge
                    level="low"
                    score={18}
                  />
                </td>

                <td className="px-5 py-4 text-slate-400 text-xs">
                  14:32
                </td>

              </tr>

              <tr className="border-t border-slate-100 hover:bg-slate-50">

                <td className="px-5 py-4 font-mono text-xs text-slate-600">
                  IDG-2026-08123
                </td>

                <td className="px-5 py-4 text-slate-700">
                  Visa
                </td>

                <td className="px-5 py-4 text-slate-700">
                  A. Kumar
                </td>

                <td className="px-5 py-4 text-slate-600">
                  Review Required
                </td>

                <td className="px-5 py-4">
                  <RiskBadge
                    level="medium"
                    score={54}
                  />
                </td>

                <td className="px-5 py-4 text-slate-400 text-xs">
                  14:18
                </td>

              </tr>

              <tr className="border-t border-slate-100 hover:bg-slate-50">

                <td className="px-5 py-4 font-mono text-xs text-slate-600">
                  IDG-2026-08122
                </td>

                <td className="px-5 py-4 text-slate-700">
                  Passport
                </td>

                <td className="px-5 py-4 text-slate-700">
                  Unknown
                </td>

                <td className="px-5 py-4 text-slate-600">
                  Rejected
                </td>

                <td className="px-5 py-4">
                  <RiskBadge
                    level="high"
                    score={82}
                  />
                </td>

                <td className="px-5 py-4 text-slate-400 text-xs">
                  13:57
                </td>

              </tr>

              <tr className="border-t border-slate-100 hover:bg-slate-50">

                <td className="px-5 py-4 font-mono text-xs text-slate-600">
                  IDG-2026-08121
                </td>

                <td className="px-5 py-4 text-slate-700">
                  National ID
                </td>

                <td className="px-5 py-4 text-slate-700">
                  Priya Singh
                </td>

                <td className="px-5 py-4 text-slate-600">
                  Verified
                </td>

                <td className="px-5 py-4">
                  <RiskBadge
                    level="low"
                    score={11}
                  />
                </td>

                <td className="px-5 py-4 text-slate-400 text-xs">
                  13:41
                </td>

              </tr>

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

// --------------------------------------------------
// Risk Row Component
// --------------------------------------------------

function RiskRow({
  label,
  value,
  percentage,
  width,
  color,
}) {
  return (
    <div>

      <div className="flex justify-between text-xs mb-2">

        <span className="text-slate-600">
          {label}
        </span>

        <span className="font-semibold text-slate-700">
          {value} · {percentage}
        </span>

      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

        <div
          className={`h-full ${color} rounded-full`}
          style={{
            width,
          }}
        />

      </div>

    </div>
  );
}