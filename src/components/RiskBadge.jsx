export default function RiskBadge({
  level,
  score,
}) {

  const config = {
    low: {
      label: "LOW",
      classes: "bg-green-50 text-green-700 border-green-200",
      dot: "bg-green-500",
    },

    medium: {
      label: "MEDIUM",
      classes: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },

    high: {
      label: "HIGH",
      classes: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },
  };

  const current =
    config[level?.toLowerCase()] || config.medium;

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded border text-[11px] font-bold tracking-wide ${current.classes}`}
    >

      <span
        className={`w-1.5 h-1.5 rounded-full ${current.dot}`}
      />

      {current.label}

      {score !== undefined && (
        <span className="font-medium">
          · {score}
        </span>
      )}

    </span>
  );
}