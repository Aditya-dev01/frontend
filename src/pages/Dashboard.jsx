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
} from "recharts";

import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";

const chartData = [
  { day: "17 Aug", screened: 145, suspicious: 12 },
  { day: "18 Aug", screened: 182, suspicious: 18 },
  { day: "19 Aug", screened: 164, suspicious: 11 },
  { day: "20 Aug", screened: 210, suspicious: 22 },
  { day: "21 Aug", screened: 196, suspicious: 15 },
  { day: "22 Aug", screened: 231, suspicious: 19 },
];

const recentCases = [
  {
    id: "IDG-2026-08124",
    document: "Passport",
    subject: "Rahul Sharma",
    result: "Verified",
    risk: "low",
    score: 18,
    time: "14:32",
  },
  {
    id: "IDG-2026-08123",
    document: "Visa",
    subject: "A. Kumar",
    result: "Review Required",
    risk: "medium",
    score: 54,
    time: "14:18",
  },
  {
    id: "IDG-2026-08122",
    document: "Passport",
    subject: "Unknown",
    result: "High Risk",
    risk: "high",
    score: 82,
    time: "13:57",
  },
  {
    id: "IDG-2026-08121",
    document: "National ID",
    subject: "Priya Singh",
    result: "Verified",
    risk: "low",
    score: 11,
    time: "13:41",
  },
];

export default function Dashboard() {

  const navigate = useNavigate();

  return (
    <div className="max-w-[1400px] mx-auto">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-7">

        <div>

          <p className="text-xs text-slate-400 font-semibold tracking-wide">
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

      {/* Stats */}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Total Screened"
          value="1,248"
          description="+8.4% from previous period"
          icon={FileCheck2}
        />

        <StatCard
          title="Verified"
          value="986"
          description="79.0% verification rate"
          icon={ShieldCheck}
          variant="success"
        />

        <StatCard
          title="Suspicious"
          value="172"
          description="13.8% require review"
          icon={AlertTriangle}
          variant="warning"
        />

        <StatCard
          title="High Risk"
          value="90"
          description="7.2% critical cases"
          icon={ShieldAlert}
          variant="danger"
        />

      </div>

      {/* Analytics */}

      <div className="grid xl:grid-cols-[2fr_1fr] gap-5 mt-5">

        <div className="bg-white border border-slate-200 rounded-lg p-5">

          <div className="flex justify-between mb-5">

            <div>

              <h2 className="font-semibold text-[#17212b]">
                Screening Activity
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Daily document screening volume
              </p>

            </div>

            <div className="text-xs text-slate-400">
              Last 6 days
            </div>

          </div>

          <div className="h-[280px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart data={chartData}>

                <defs>

                  <linearGradient
                    id="screening"
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

                <XAxis
                  dataKey="day"
                  tick={{
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="screened"
                  stroke="#1677b8"
                  fill="url(#screening)"
                  strokeWidth={2}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Risk Summary */}

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
              value="986"
              percentage="79%"
              width="79%"
              color="bg-green-500"
            />

            <RiskRow
              label="Medium Risk"
              value="172"
              percentage="14%"
              width="14%"
              color="bg-amber-500"
            />

            <RiskRow
              label="High Risk"
              value="90"
              percentage="7%"
              width="7%"
              color="bg-red-500"
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

      {/* Recent cases */}

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

              {recentCases.map((item) => (

                <tr
                  key={item.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >

                  <td className="px-5 py-4 font-mono text-xs text-slate-600">
                    {item.id}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {item.document}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {item.subject}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {item.result}
                  </td>

                  <td className="px-5 py-4">
                    <RiskBadge
                      level={item.risk}
                      score={item.score}
                    />
                  </td>

                  <td className="px-5 py-4 text-slate-400 text-xs">
                    {item.time}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

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