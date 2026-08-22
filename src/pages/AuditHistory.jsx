const history = [
  {
    id: "DOC-10021",
    type: "Passport",
    officer: "Officer Sharma",
    score: 18,
    decision: "Verified",
    date: "22 Aug 2026 14:32",
  },
  {
    id: "DOC-10022",
    type: "Visa",
    officer: "Officer Kumar",
    score: 82,
    decision: "Suspicious",
    date: "22 Aug 2026 14:10",
  },
  {
    id: "DOC-10023",
    type: "National ID",
    officer: "Officer Singh",
    score: 35,
    decision: "Verified",
    date: "21 Aug 2026 18:42",
  },
];

export default function AuditHistory() {

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-white">
          Investigation & Audit History
        </h1>

        <p className="text-slate-400 mt-1">
          Previous document screening activities
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-950">

              <tr className="text-left text-slate-500 text-sm">

                <th className="p-4">
                  Document ID
                </th>

                <th className="p-4">
                  Document Type
                </th>

                <th className="p-4">
                  Officer
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
                  key={item.id}
                  className="border-t border-slate-800 text-sm"
                >

                  <td className="p-4 text-cyan-400">
                    {item.id}
                  </td>

                  <td className="p-4 text-slate-300">
                    {item.type}
                  </td>

                  <td className="p-4 text-slate-400">
                    {item.officer}
                  </td>

                  <td className="p-4 text-slate-400">
                    {item.date}
                  </td>

                  <td className="p-4">

                    <span
                      className={
                        item.score >= 70
                          ? "text-red-400"
                          : item.score >= 40
                          ? "text-yellow-400"
                          : "text-green-400"
                      }
                    >
                      {item.score}/100
                    </span>

                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        item.decision === "Verified"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {item.decision}
                    </span>

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