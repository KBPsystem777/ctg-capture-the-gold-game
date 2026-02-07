"use client";

import { useState } from "react";
import { GameClaim } from "@/lib/game-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface DecisionPanelProps {
  claim: GameClaim;
  onDecision: (decision: "approved" | "rejected") => void;
  result?: "approved" | "rejected";
}

export default function DecisionPanel({
  claim,
  onDecision,
  result,
}: DecisionPanelProps) {
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const handleDecision = async (decision: "approved" | "rejected") => {
    setLoading(true);
    try {
      const response = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          claimId: claim.id,
          goldWeight: claim.gold_weight_kg,
          claimDate: claim.claimed_date,
          location: claim.claimed_location,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEvaluation(data.evaluation);
        onDecision(decision);
      }
    } catch (error) {
      console.error("Failed to submit decision:", error);
    } finally {
      setLoading(false);
    }
  };

  if (result && evaluation) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-accent">Decision Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Result */}
          <div className="flex items-center gap-3">
            {evaluation.regulatorCorrect ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-bold text-foreground">Correct Decision!</p>
                  <p className="text-sm text-muted-foreground">
                    {evaluation.message}
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-500" />
                <div>
                  <p className="font-bold text-foreground">
                    Incorrect Decision
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {evaluation.message}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Lesson */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
              The Trust Hierarchy
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted text-muted-foreground px-2 py-1">
                  <tr>
                    <th className="px-3 py-2 font-medium">Layer</th>
                    <th className="px-3 py-2 font-medium">Can Persuade</th>
                    <th className="px-3 py-2 font-medium">Can Lie</th>
                    <th className="px-3 py-2 font-medium">Can Decide</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-transparent">
                  <tr className="text-muted-foreground italic">
                    <td className="px-3 py-2 text-foreground font-medium">
                      Human / AI
                    </td>
                    <td className="px-3 py-2">✅</td>
                    <td className="px-3 py-2">✅</td>
                    <td className="px-3 py-2 text-red-500">❌</td>
                  </tr>
                  <tr className="text-muted-foreground italic">
                    <td className="px-3 py-2 text-foreground font-medium">
                      Documents
                    </td>
                    <td className="px-3 py-2">✅</td>
                    <td className="px-3 py-2">✅</td>
                    <td className="px-3 py-2 text-red-500">❌</td>
                  </tr>
                  <tr className="text-primary font-bold bg-primary/5">
                    <td className="px-3 py-2">Ledger</td>
                    <td className="px-3 py-2">❌</td>
                    <td className="px-3 py-2">❌</td>
                    <td className="px-3 py-2 text-green-500 underline decoration-2 underline-offset-4">
                      ✅ Decide
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-foreground bg-primary/10 p-4 rounded-lg mt-4 border-l-4 border-primary italic leading-relaxed">
              "AI talks, documents persuade, but only the ledger decides."
            </p>
          </div>

          {/* Your Decision */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Your Decision
            </p>
            <Badge
              className={`text-sm font-semibold ${
                result === "approved"
                  ? "bg-green-900/30 text-green-100 border-green-700"
                  : "bg-red-900/30 text-red-100 border-red-700"
              }`}
            >
              {result === "approved" ? "APPROVED" : "REJECTED"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="md:static fixed bottom-0 left-0 right-0 z-50 p-4 md:p-0 md:mb-0">
      <div className="mx-auto max-w-3xl">
        <Card className="bg-card border-border rounded-t-lg shadow-lg md:rounded">
          <CardHeader>
            <CardTitle className="text-accent">Make Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Instructions */}
            <div className="bg-secondary p-3 rounded flex gap-2">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Review the claim details, consult the ledger, and make your
                decision. Trust the ledger, not persuasion.
              </p>
            </div>

            {/* Decision Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleDecision("approved")}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "✓ Release Payment (Approve)"
                )}
              </Button>
              <Button
                onClick={() => handleDecision("rejected")}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "✗ Reject (Ledger Mismatch)"
                )}
              </Button>
            </div>

            {/* Warning */}
            <div className="text-xs text-muted-foreground text-center">
              This decision is final. Choose wisely.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
