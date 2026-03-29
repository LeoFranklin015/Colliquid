"use client";

interface AgentResult {
  agent: string;
  approved: boolean;
  confidence: number;
  reasoning: string;
  flags: string[];
  timestamp: number;
}

const AGENT_LABELS: Record<string, { name: string; icon: string }> = {
  "lead-analyst": { name: "Lead Analyst", icon: "1" },
  "compliance-officer": { name: "Compliance Officer", icon: "2" },
  "valuation-auditor": { name: "Valuation Auditor", icon: "3" },
  "risk-assessor": { name: "Risk Assessor", icon: "4" },
  "privacy-guardian": { name: "Privacy Guardian", icon: "5" },
};

export default function AgentCard({
  agent,
  result,
}: {
  agent: string;
  result: AgentResult | null;
}) {
  const label = AGENT_LABELS[agent] || { name: agent, icon: "?" };

  // Pending state
  if (!result) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
            {label.icon}
          </div>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{label.name}</p>
            <p className="text-xs text-zinc-400">Waiting...</p>
          </div>
        </div>
      </div>
    );
  }

  const approved = result.approved;
  const borderColor = approved
    ? "border-green-300 dark:border-green-800"
    : "border-red-300 dark:border-red-800";
  const bgColor = approved
    ? "bg-green-50 dark:bg-green-950/30"
    : "bg-red-50 dark:bg-red-950/30";
  const dotColor = approved ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} p-4`}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
            approved ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {label.icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{label.name}</p>
          <div className="flex items-center gap-1.5">
            <span className={`inline-block h-2 w-2 rounded-full ${dotColor}`} />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {approved ? "Approved" : "Rejected"} &middot; {result.confidence}% confidence
            </span>
          </div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mb-3 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-2 rounded-full transition-all ${approved ? "bg-green-500" : "bg-red-500"}`}
          style={{ width: `${result.confidence}%` }}
        />
      </div>

      {/* Reasoning */}
      <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">{result.reasoning}</p>

      {/* Flags */}
      {result.flags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {result.flags.map((flag, i) => (
            <span
              key={i}
              className="inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/50 dark:text-red-300"
            >
              {flag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
