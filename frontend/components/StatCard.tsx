"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: "blue" | "emerald" | "purple" | "orange";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function StatCard({ 
  label, 
  value, 
  unit, 
  color = "blue", 
  isLoading,
  children 
}: StatCardProps) {
  const colorMap = {
    blue: "hover:border-blue-500/30 group-hover:bg-blue-500/10 text-blue-500",
    emerald: "hover:border-emerald-500/30 group-hover:bg-emerald-500/10 text-emerald-500",
    purple: "hover:border-purple-500/30 group-hover:bg-purple-500/10 text-purple-500",
    orange: "hover:border-orange-500/30 group-hover:bg-orange-500/10 text-orange-500",
  };

  const accentColor = colorMap[color];

  return (
    <div className={`p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 relative overflow-hidden group ${accentColor.split(" ")[0]}`}>
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 transition-all duration-500 ${accentColor.split(" ")[1]}`} />
      
      <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2 relative z-10">{label}</p>
      <h3 className="text-4xl font-bold text-white tracking-tight relative z-10">
        {isLoading ? (
          <span className="animate-pulse opacity-50">...</span>
        ) : (
          <>
            {value} <span className={`text-2xl lowercase font-medium ${accentColor.split(" ")[2]}`}>{unit}</span>
          </>
        )}
      </h3>
      
      {children && <div className="mt-6 relative z-10">{children}</div>}
    </div>
  );
}
