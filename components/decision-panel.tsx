"use client";

import { GameClaim } from "@/lib/game-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface DecisionPanelProps {
  claim: GameClaim;
  onDecision: (decision: "approved" | "rejected") => void;
  result?: "approved" | "rejected";
  loading?: boolean;
  evaluation?: any;
  onShowExplanation?: () => void;
}

export default function DecisionPanel({
  claim,
  onDecision,
  result,
  loading = false,
  evaluation,
  onShowExplanation,
}: DecisionPanelProps & { onShowExplanation?: () => void }) {
  // If a final result is provided along with evaluation, render the result state
  if (result && evaluation) {
    return (
      <Card className="bg-card border-border shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="text-[#005D9F]">Decision Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Result */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border shadow-sm">
            {evaluation.regulatorCorrect ? (
              <>
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg text-green-700">
                    Correct Decision!
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {evaluation.message}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg text-red-700">
                    Incorrect Decision
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {evaluation.message}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Lesson */}
          <div className="pt-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full"></span>
              The Trust Hierarchy
            </p>
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
              <div className="rounded-xl border border-border overflow-hidden min-w-[300px]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#005D9F] text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                        Layer
                      </th>
                      <th className="px-3 py-3 font-semibold uppercase tracking-wider text-center">
                        Persuade
                      </th>
                      <th className="px-3 py-3 font-semibold uppercase tracking-wider text-center">
                        Lie
                      </th>
                      <th className="px-3 py-3 font-semibold uppercase tracking-wider text-center">
                        Decide
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-transparent">
                    <tr className="bg-background/40">
                      <td className="px-4 py-3 text-foreground font-medium">
                        Human / AI
                      </td>
                      <td className="px-3 py-3 text-center text-green-600 font-bold">
                        ✅
                      </td>
                      <td className="px-3 py-3 text-center text-green-600 font-bold">
                        ✅
                      </td>
                      <td className="px-3 py-3 text-center text-red-500 font-bold">
                        ❌
                      </td>
                    </tr>
                    <tr className="bg-background/40">
                      <td className="px-4 py-3 text-foreground font-medium">
                        Documents
                      </td>
                      <td className="px-3 py-3 text-center text-green-600 font-bold">
                        ✅
                      </td>
                      <td className="px-3 py-3 text-center text-green-600 font-bold">
                        ✅
                      </td>
                      <td className="px-3 py-3 text-center text-red-500 font-bold">
                        ❌
                      </td>
                    </tr>
                    <tr className="bg-primary/5 font-bold">
                      <td className="px-4 py-4 text-primary">Ledger</td>
                      <td className="px-3 py-4 text-center text-red-500 font-bold">
                        ❌
                      </td>
                      <td className="px-3 py-4 text-center text-red-500 font-bold">
                        ❌
                      </td>
                      <td className="px-3 py-4 text-center text-green-600">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200 uppercase text-[10px] tracking-tighter">
                          ✅ Authority
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#005D9F]/5 p-5 rounded-2xl mt-6 border border-[#005D9F]/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <CheckCircle2 className="w-16 h-16 text-primary scale-150" />
              </div>
              <p className="text-[#005D9F] text-sm md:text-base font-semibold italic leading-relaxed relative z-10">
                "AI talks, documents persuade, but only the ledger decides."
              </p>
            </div>
          </div>

          {/* Explanation */}
          {evaluation.explanation && (
            <div className="p-4 mt-4 rounded-lg bg-muted/30 border border-border text-sm text-muted-foreground">
              <p className="font-semibold mb-2">Why this result:</p>
              <p>{evaluation.explanation}</p>
              {typeof onShowExplanation === "function" && (
                <div className="mt-3">
                  <Button
                    onClick={onShowExplanation}
                    variant="outline"
                    className="text-sm"
                  >
                    Why this result?
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-[#005D9F] hover:bg-[#004a80] text-white py-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Play Another Round
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden mt-4">
      <CardHeader className="bg-muted/30 border-b border-border/50">
        <CardTitle className="text-[#005D9F]">Regulatory Action</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm text-foreground leading-relaxed">
            <p className="font-semibold text-[#005D9F] mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Final Decision Required
            </p>
            Review the ledger entries against the claim before making your call.
            Trust the ledger, not persuasion.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={() => onDecision("approved")}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white py-8 rounded-2xl flex flex-col gap-1 shadow-lg shadow-green-900/10 transition-all active:scale-[0.98]"
              aria-label="Release Payment"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="text-lg font-bold">RELEASE</span>
                  <span className="text-[10px] opacity-80 uppercase tracking-widest font-medium">
                    Payment
                  </span>
                </>
              )}
            </Button>
            <Button
              onClick={() => onDecision("rejected")}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white py-8 rounded-2xl flex flex-col gap-1 shadow-lg shadow-red-900/10 transition-all active:scale-[0.98]"
              aria-label="Reject Claim"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="text-lg font-bold">REJECT</span>
                  <span className="text-[10px] opacity-80 uppercase tracking-widest font-medium">
                    Claim
                  </span>
                </>
              )}
            </Button>
          </div>

          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em] font-medium pt-2">
            This action is final and will be recorded.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
