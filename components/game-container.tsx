"use client";

import { useState, useEffect, useRef } from "react";
import { SAMPLE_CLAIMS } from "@/lib/game-state";
import LedgerPanel from "./ledger-panel";
import ChatPanel from "./chat-panel";
import ClaimPanel from "./claim-panel";
import DecisionPanel from "./decision-panel";
import QuickDecisionBar from "./quick-decision-bar";
import DecisionModal from "./decision-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, MessageSquare, ShieldCheck } from "lucide-react";

interface GameContainerProps {
  claimId: string;
  onReset: () => void;
}

export default function GameContainer({
  claimId,
  onReset,
}: GameContainerProps) {
  const claim = SAMPLE_CLAIMS.find((c) => c.id === claimId);
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(
    null,
  );
  const [showResult, setShowResult] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [sessionHash, setSessionHash] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const initialized = useRef(false);

  // Ensure a session exists for this play-through (server sets HttpOnly cookie)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const createSession = async () => {
      setSessionLoading(true);
      try {
        const res = await fetch("/api/session", { method: "POST" });
        const data = await res.json();
        if (data.success) setSessionHash(data.data.hash);
      } catch (e) {
        console.error("Failed to create session", e);
      } finally {
        setSessionLoading(false);
      }
    };
    createSession();
  }, []);

  const [activeTab, setActiveTab] = useState<"details" | "chat" | "verify">(
    "chat",
  );

  // Submit decision (centralized) so evaluation can be lifted to parent state
  const submitDecision = async (decisionVal: "approved" | "rejected") => {
    setDecisionLoading(true);
    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision: decisionVal,
          claimId: claim.id,
          goldWeight: claim.gold_weight_kg,
          claimDate: claim.claimed_date,
          location: claim.claimed_location,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEvaluation(data.evaluation);
        setDecision(decisionVal);
        setShowResult(true);
        // On mobile, switch to Verify tab so result is visible immediately
        setActiveTab("verify"); // Auto-open the detailed explanation modal to emphasize ledger evidence
        setShowDecisionModal(true);
      } else {
        console.error("Decision API returned an error", data);
      }
    } catch (err) {
      console.error("Failed to submit decision", err);
    } finally {
      setDecisionLoading(false);
    }
  };

  if (!claim) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Claim Not Found
          </h1>
          <Button onClick={onReset} className="bg-primary hover:bg-primary/90">
            Back to Claims
          </Button>
        </div>
      </div>
    );
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#FBFCFD] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-50 max-w-sm w-full">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-[#005D9F] mb-2">
            Initializing Audit...
          </h2>
          <p className="text-muted-foreground text-sm">
            Contacting the central ledger to establish a secure regulatory
            session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFD] text-foreground p-4 md:p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#005D9F]">
            C2G: Regulatory Desk
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Claim: {claim.claimant_name}
          </p>
          {sessionHash && (
            <p className="text-xs text-muted-foreground mt-1">
              Ledger Hash:{" "}
              <span className="font-mono">
                {sessionHash.substring(0, 12)}...
              </span>
            </p>
          )}
        </div>
        <Button
          variant="outline"
          onClick={onReset}
          className="border-border text-foreground hover:bg-secondary whitespace-nowrap bg-transparent"
        >
          ← Back
        </Button>
      </div>

      {/* Main Grid - Desktop Layout */}
      <div className="hidden lg:grid grid-cols-3 gap-6 auto-rows-max">
        {/* Left Column: Claim & Documents */}
        <div className="space-y-4">
          <ClaimPanel claim={claim} />
        </div>

        {/* Middle Column: Chat */}
        <div className="space-y-4">
          <ChatPanel claim={claim} />
        </div>

        {/* Right Column: Ledger & Decision */}
        <div className="space-y-4">
          <LedgerPanel />
          {!showResult && (
            <DecisionPanel
              claim={claim}
              onDecision={(d) => submitDecision(d)}
              loading={decisionLoading}
            />
          )}
          {showResult && decision && (
            <DecisionPanel
              claim={claim}
              onDecision={setDecision}
              result={decision}
              evaluation={evaluation}
              onShowExplanation={() => setShowDecisionModal(true)}
            />
          )}

          <DecisionModal
            open={showDecisionModal}
            onOpenChange={setShowDecisionModal}
            evaluation={evaluation}
            claim={claim}
            ledgerTransaction={evaluation?.ledgerMatch?.transaction || null}
            sessionHash={sessionHash}
          />
        </div>
      </div>

      {/* Mobile/Tablet Layout - Tabs */}
      <div className="lg:hidden">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl h-auto">
            <TabsTrigger
              value="details"
              className="py-2.5 flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
            >
              <Info className="w-4 h-4" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="py-2.5 flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="verify"
              className="py-2.5 flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <ClaimPanel claim={claim} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <ChatPanel claim={claim} />
          </TabsContent>

          <TabsContent value="verify" className="space-y-4">
            <LedgerPanel />
            {!showResult && (
              <DecisionPanel
                claim={claim}
                onDecision={(d) => submitDecision(d)}
                loading={decisionLoading}
              />
            )}
            {showResult && decision && (
              <DecisionPanel
                claim={claim}
                onDecision={setDecision}
                result={decision}
                evaluation={evaluation}
                onShowExplanation={() => setShowDecisionModal(true)}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Quick decision bar for mobile - visible outside of the Verify tab to lower friction */}
        {!showResult && (
          <QuickDecisionBar
            onAction={(d) => submitDecision(d)}
            loading={decisionLoading}
          />
        )}
      </div>
    </div>
  );
}
