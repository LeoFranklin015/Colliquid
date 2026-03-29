"use client";

import { useState } from "react";
import TriggerPanel from "./components/TriggerPanel";
import LiveFeed from "./components/LiveFeed";
import HistoryTable from "./components/HistoryTable";

interface EvalId {
  collateralId: number;
  evalId: string;
}

export default function AIPage() {
  const [activeEvals, setActiveEvals] = useState<EvalId[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleEvaluationStarted(evals: EvalId[]) {
    setActiveEvals(evals);
  }

  function handleEvaluationComplete() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            AI Agent Evaluation
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Multi-agent swarm evaluates loan collateral for tokenization eligibility
          </p>
        </div>

        <div className="space-y-6">
          <div id="trigger-panel">
            <TriggerPanel onEvaluationStarted={handleEvaluationStarted} />
          </div>

          {activeEvals.length > 0 && (
            <div id="live-feed">
              <LiveFeed
                evaluations={activeEvals}
                onComplete={handleEvaluationComplete}
              />
            </div>
          )}

          <div id="history-table">
            <HistoryTable key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
