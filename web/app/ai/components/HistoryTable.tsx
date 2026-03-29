"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface EvaluationSummary {
  id: string;
  collateralId: number;
  finalVerdict: boolean;
  status: string;
  createdAt: number;
  agents: {
    agent: string;
    approved: boolean;
    confidence: number;
  }[];
}

export default function HistoryTable() {
  const [evaluations, setEvaluations] = useState<EvaluationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/ai/evaluations`)
      .then((r) => r.json())
      .then((data) => setEvaluations(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500">Loading history...</p>
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Evaluation History
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No evaluations yet. Use the panel above to start one.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Evaluation History
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700 text-left">
              <th className="pb-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">Collateral</th>
              <th className="pb-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">Verdict</th>
              <th className="pb-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">Agents</th>
              <th className="pb-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">Avg Score</th>
              <th className="pb-2 font-medium text-zinc-500 dark:text-zinc-400">Time</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((ev) => {
              const avg =
                ev.agents.length > 0
                  ? Math.round(ev.agents.reduce((s, a) => s + a.confidence, 0) / ev.agents.length)
                  : 0;
              const isExpanded = expanded === ev.id;

              return (
                <tr
                  key={ev.id}
                  onClick={() => setExpanded(isExpanded ? null : ev.id)}
                  className="border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="py-3 pr-4 font-mono text-zinc-900 dark:text-zinc-100">
                    #{ev.collateralId}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        ev.finalVerdict
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                      }`}
                    >
                      {ev.finalVerdict ? "Approved" : "Rejected"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-1">
                      {ev.agents.map((a) => (
                        <span
                          key={a.agent}
                          className={`inline-block h-5 w-5 rounded-full text-center text-xs leading-5 font-bold text-white ${
                            a.approved ? "bg-green-500" : "bg-red-500"
                          }`}
                          title={`${a.agent}: ${a.approved ? "Approved" : "Rejected"} (${a.confidence}%)`}
                        >
                          {a.confidence > 0 ? "" : "!"}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-zinc-900 dark:text-zinc-100">
                    {avg}%
                  </td>
                  <td className="py-3 text-zinc-500 dark:text-zinc-400">
                    {new Date(ev.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
