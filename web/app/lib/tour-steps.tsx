import type { Tour } from "nextstepjs";

export const tours: Tour[] = [
  {
    tour: "bank-portfolio",
    steps: [
      {
        icon: <>👋</>,
        title: "Welcome to Colliquid",
        content: (
          <p>
            This platform tokenizes pre-liquidation bank collateral on Rayls.
            Banks register loans privately, AI evaluates them, and investors buy
            fractional tokens on the public chain.
          </p>
        ),
        side: "bottom",
        showControls: true,
        showSkip: true,
      },
      {
        icon: <>➕</>,
        title: "Register Collateral",
        content: (
          <p>
            Click here to register new loan collateral on your privacy node.
            You'll enter the loan amount, interest rate, yield, collateral type,
            and a description.
          </p>
        ),
        selector: "#register-btn",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 8,
        pointerRadius: 12,
      },
      {
        icon: <>📊</>,
        title: "Portfolio Stats",
        content: (
          <p>
            Track your total collateral value, number of assets, active loans,
            and how many have been tokenized.
          </p>
        ),
        selector: "#stats-strip",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 4,
        pointerRadius: 0,
      },
      {
        icon: <>📋</>,
        title: "Collateral Cards",
        content: (
          <p>
            Each card shows a loan from the privacy node — type, interest, yield,
            value, and LTV. Click for details. The "Attested" badge means AI
            evaluation is recorded on the public chain.
          </p>
        ),
        selector: "#asset-grid",
        side: "right",
        showControls: true,
        showSkip: true,
        pointerPadding: 8,
        pointerRadius: 16,
      },
      {
        icon: <>🧠</>,
        title: "AI Evaluation",
        content: (
          <p>
            Click the brain icon to trigger a 5-agent AI swarm: Lead Analyst,
            Compliance Officer, Valuation Auditor, Risk Assessor, and Privacy
            Guardian. All must approve for tokenization.
          </p>
        ),
        selector: "#first-analyse-btn",
        side: "left",
        showControls: true,
        showSkip: true,
        pointerPadding: 8,
        pointerRadius: 8,
      },
      {
        icon: <>📡</>,
        title: "Agent Stream",
        content: (
          <p>
            Watch the full pipeline in real-time: AI evaluation, on-chain
            attestation, ERC-1155 minting, bridge to public chain, and
            marketplace listing. TX hashes link to the block explorer.
          </p>
        ),
        selector: "#agent-log",
        side: "left",
        showControls: true,
        showSkip: true,
        pointerPadding: 4,
        pointerRadius: 16,
      },
    ],
  },
  {
    tour: "marketplace",
    steps: [
      {
        icon: <>🏪</>,
        title: "Public Marketplace",
        content: (
          <p>
            This page shows only public-chain data — no borrower details. Investors
            browse tokenized collateral fractions with yield, LTV, and duration.
          </p>
        ),
        side: "bottom",
        showControls: true,
        showSkip: true,
      },
      {
        icon: <>📦</>,
        title: "Listing Cards",
        content: (
          <p>
            Each listing shows the total value, price per fraction, yield, LTV,
            default days, duration, and how many fractions are sold. All data
            comes from the public chain — nothing private is exposed.
          </p>
        ),
        selector: "#listings-grid",
        side: "top",
        showControls: true,
        showSkip: true,
        pointerPadding: 8,
        pointerRadius: 16,
      },
      {
        icon: <>💰</>,
        title: "Buy Fractions",
        content: (
          <p>
            Click a listing to open the details modal. Pick the number of
            fractions and click Buy. The transaction calls buyFraction on the
            marketplace contract — real on-chain settlement.
          </p>
        ),
        selector: "#first-listing-card",
        side: "right",
        showControls: true,
        showSkip: true,
        pointerPadding: 8,
        pointerRadius: 16,
      },
    ],
  },
  {
    tour: "ai-evaluation",
    steps: [
      {
        icon: <>🤖</>,
        title: "AI Evaluation Panel",
        content: (
          <p>
            Enter collateral IDs to evaluate, or click "Evaluate All" to run the
            5-agent swarm on every active collateral.
          </p>
        ),
        selector: "#trigger-panel",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 8,
        pointerRadius: 12,
      },
      {
        icon: <>📡</>,
        title: "Live Agent Feed",
        content: (
          <p>
            Agent results stream in real-time via SSE. Each agent card shows
            approved/rejected, confidence score, reasoning, and flags. The
            attestation UID links to the public chain.
          </p>
        ),
        selector: "#live-feed",
        side: "top",
        showControls: true,
        showSkip: true,
        pointerPadding: 8,
        pointerRadius: 12,
      },
      {
        icon: <>📜</>,
        title: "Evaluation History",
        content: (
          <p>
            All past evaluations with verdict, agent scores, and timestamps.
            Click a row to expand details.
          </p>
        ),
        selector: "#history-table",
        side: "top",
        showControls: true,
        showSkip: true,
        pointerPadding: 8,
        pointerRadius: 12,
      },
    ],
  },
];
