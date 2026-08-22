export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
}) {

  const variants = {
    default: "text-[#1677b8] bg-blue-50",
    success: "text-green-600 bg-green-50",
    warning: "text-amber-600 bg-amber-50",
    danger: "text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-[#17212b] mt-2">
            {value}
          </p>

          {description && (
            <p className="text-xs text-slate-400 mt-2">
              {description}
            </p>
          )}

        </div>

        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${variants[variant]}`}
        >
          <Icon size={20} />
        </div>

      </div>

    </div>
  );
}