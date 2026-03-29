"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface EvalId {
  collateralId: number;
  evalId: string;
}

export default function TriggerPanel({
  onEvaluationStarted,
}: {
  onEvaluationStarted: (evals: EvalId[]) => void;
}) {
  const [ids, setIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEvaluate(evaluateAll: boolean) {
    setLoading(true);
    setError("");
    try {
      const body = evaluateAll
        ? {}
        : { collateralIds: ids.split(",").map((s) => Number(s.trim())).filter(Boolean) };

      const res = await fetch(`${API_BASE}/ai/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to start evaluation");
      }

      const data = await res.json();
      onEvaluationStarted(data.evaluationIds);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Evaluate Collateral
      </h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-1">
            Collateral IDs (comma-separated)
          </label>
          <input
            type="text"
            value={ids}
            onChange={(e) => setIds(e.target.value)}
            placeholder="1, 2, 3"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <button
          onClick={() => handleEvaluate(false)}
          disabled={loading || !ids.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Starting..." : "Evaluate Selected"}
        </button>
        <button
          onClick={() => handleEvaluate(true)}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Starting..." : "Evaluate All"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
