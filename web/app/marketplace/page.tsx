"use client";

import { useState, useMemo } from "react";
import CollateralModal from "../components/CollateralModal";

interface Listing {
  id: string;
  grade: string;
  raise: string;
  raiseNum: number;
  shares: number;
  pricePerShare: string;
  ltv: string;
  timeline: string;
  yield: string;
  issuer: string;
  attestedAgo: string;
  currency: string;
  valuation: string;
  loan: string;
  defaultDays: string;
  legalStatus: string;
  netProceeds: string;
}

const listings: Listing[] = [
  {
    id: "CLQ-0041",
    grade: "A",
    raise: "£800K",
    raiseNum: 800000,
    shares: 800,
    pricePerShare: "£1,000",
    ltv: "50%",
    timeline: "60 days",
    yield: "~25%",
    issuer: "hsbc.rayls.eth",
    attestedAgo: "2h ago",
    currency: "£",
    valuation: "£2,000,000",
    loan: "£1,000,000",
    defaultDays: "94",
    legalStatus: "Enforcement commenced",
    netProceeds: "£800,000",
  },
  {
    id: "CLQ-0038",
    grade: "A",
    raise: "£1.7M",
    raiseNum: 1700000,
    shares: 1700,
    pricePerShare: "£1,000",
    ltv: "59%",
    timeline: "45 days",
    yield: "~18%",
    issuer: "barclays.rayls.eth",
    attestedAgo: "5h ago",
    currency: "£",
    valuation: "£4,100,000",
    loan: "£2,400,000",
    defaultDays: "121",
    legalStatus: "LPA Receiver Appointed",
    netProceeds: "£1,700,000",
  },
  {
    id: "CLQ-0045",
    grade: "B+",
    raise: "£280K",
    raiseNum: 280000,
    shares: 280,
    pricePerShare: "£1,000",
    ltv: "55%",
    timeline: "90 days",
    yield: "~14%",
    issuer: "lloyds.rayls.eth",
    attestedAgo: "8h ago",
    currency: "£",
    valuation: "£620,000",
    loan: "£340,000",
    defaultDays: "103",
    legalStatus: "Asset seizure filed",
    netProceeds: "£280,000",
  },
  {
    id: "CLQ-0039",
    grade: "A",
    raise: "R$1.2M",
    raiseNum: 1200000,
    shares: 1200,
    pricePerShare: "R$1,000",
    ltv: "48%",
    timeline: "75 days",
    yield: "~22%",
    issuer: "bradesco.rayls.eth",
    attestedAgo: "3h ago",
    currency: "R$",
    valuation: "R$2,500,000",
    loan: "R$1,200,000",
    defaultDays: "102",
    legalStatus: "Judicial enforcement filed",
    netProceeds: "R$1,200,000",
  },
  {
    id: "CLQ-0033",
    grade: "A",
    raise: "£1.4M",
    raiseNum: 1400000,
    shares: 1400,
    pricePerShare: "£1,000",
    ltv: "56%",
    timeline: "120 days",
    yield: "~12%",
    issuer: "natwest.rayls.eth",
    attestedAgo: "1d ago",
    currency: "£",
    valuation: "£3,200,000",
    loan: "£1,800,000",
    defaultDays: "145",
    legalStatus: "Possession order granted",
    netProceeds: "£1,400,000",
  },
  {
    id: "CLQ-0047",
    grade: "B+",
    raise: "£700K",
    raiseNum: 700000,
    shares: 700,
    pricePerShare: "£1,000",
    ltv: "53%",
    timeline: "90 days",
    yield: "~14%",
    issuer: "lloyds.rayls.eth",
    attestedAgo: "1d ago",
    currency: "£",
    valuation: "£1,500,000",
    loan: "£800,000",
    defaultDays: "67",
    legalStatus: "Pending enforcement",
    netProceeds: "£700,000",
  },
];

const allGrades = ["A", "B+"];

export default function Marketplace() {
  const [selected, setSelected] = useState<Listing | null>(null);
  const [gradeFilter, setGradeFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"raiseNum" | "yield" | "timeline">("raiseNum");

  const filtered = useMemo(() => {
    let result = [...listings];
    if (gradeFilter !== "All") result = result.filter((l) => l.grade === gradeFilter);
    result.sort((a, b) => {
      if (sortBy === "raiseNum") return b.raiseNum - a.raiseNum;
      if (sortBy === "yield") return parseFloat(b.yield) - parseFloat(a.yield);
      return parseInt(a.timeline) - parseInt(b.timeline);
    });
    return result;
  }, [gradeFilter, sortBy]);

  const toModalData = (l: Listing) => ({
    type: l.id,
    location: "Withheld",
    grade: l.grade,
    valuation: l.valuation,
    loan: l.loan,
    ltv: l.ltv,
    defaultDays: l.defaultDays,
    legalStatus: l.legalStatus,
    timeline: `~${l.timeline}`,
    netProceeds: l.netProceeds,
    issuer: l.issuer,
    attestedAgo: l.attestedAgo,
    sharePrice: l.pricePerShare,
    sharesAvailable: l.shares,
    currency: l.currency,
  });

  return (
    <>
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="mx-auto w-full max-w-[1200px] px-8 pt-16 pb-6">
          <p className="mb-1 font-mono text-[12px] tracking-[0.2em] text-muted uppercase">
            Public L1
          </p>
          <h1 className="font-serif text-[36px] font-light tracking-tight text-foreground">
            Marketplace
          </h1>
        </div>

        {/* Filters */}
        <div className="mx-auto w-full max-w-[1200px] border-t border-border px-8 py-6">
          <div className="flex items-center gap-3">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-foreground outline-none"
            >
              <option value="All">All grades</option>
              {allGrades.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="cursor-pointer rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-foreground outline-none"
            >
              <option value="raiseNum">Sort: raise amount</option>
              <option value="yield">Sort: yield</option>
              <option value="timeline">Sort: timeline</option>
            </select>

            <span className="ml-auto text-[13px] text-muted">
              {filtered.length} listing{filtered.length !== 1 && "s"}
            </span>
          </div>
        </div>

        {/* Listings */}
        <div className="mx-auto w-full max-w-[1200px] px-8 pb-16">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing) => (
              <button
                key={listing.id}
                onClick={() => setSelected(listing)}
                className="group cursor-pointer rounded-2xl bg-card p-6 text-left transition-colors hover:bg-card-warm/50"
              >
                {/* ID + Grade */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[12px] text-muted">
                    {listing.id}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-medium ${
                      listing.grade === "A" ? "text-success" : "text-accent"
                    }`}
                  >
                    {listing.grade}
                  </span>
                </div>

                {/* Raise — hero of the card */}
                <p className="font-serif text-[32px] font-light tracking-tight text-foreground">
                  {listing.raise}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  {listing.shares.toLocaleString()} shares at{" "}
                  {listing.pricePerShare}
                </p>

                {/* Key metrics */}
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-4">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-muted uppercase">
                      LTV
                    </p>
                    <p className="font-mono text-[14px] text-foreground">
                      {listing.ltv}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-muted uppercase">
                      Yield
                    </p>
                    <p className="font-mono text-[14px] text-foreground">
                      {listing.yield}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-muted uppercase">
                      Timeline
                    </p>
                    <p className="font-mono text-[14px] text-foreground">
                      {listing.timeline}
                    </p>
                  </div>
                </div>

                {/* Default + Legal */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-muted uppercase">
                      Default
                    </p>
                    <p className="font-mono text-[13px] text-foreground">
                      {listing.defaultDays}d
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-muted uppercase">
                      Valuation
                    </p>
                    <p className="font-mono text-[13px] text-foreground">
                      {listing.valuation}
                    </p>
                  </div>
                </div>

                {/* Issuer + attestation */}
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-mono text-[11px] text-muted">
                    {listing.issuer}
                  </span>
                  <span className="text-[11px] text-muted-light">
                    {listing.attestedAgo}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-[14px] text-muted">
              No listings match the selected filters.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border">
          <div className="mx-auto w-full max-w-[1200px] px-8 py-10">
            <p className="text-[13px] leading-relaxed text-muted">
              All listings AI-attested on Rayls. Asset type, location, and
              borrower identity withheld. Only financial metrics, legal status,
              and verified issuer are disclosed. Settlement via atomic DvP.
            </p>
          </div>
        </div>
      </div>

      {selected && (
        <CollateralModal
          data={toModalData(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
