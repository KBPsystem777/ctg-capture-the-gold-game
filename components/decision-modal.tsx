"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, CheckCircle2, Search } from "lucide-react";

interface DecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: any;
  claim: any;
  ledgerTransaction: any | null;
  sessionHash?: string | null;
}

export default function DecisionModal({
  open,
  onOpenChange,
  evaluation,
  claim,
  ledgerTransaction,
  sessionHash,
}: DecisionModalProps) {
  if (!evaluation) return null;

  const { regulatorCorrect, message, explanation, basis } = evaluation;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-full">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {regulatorCorrect ? (
              <div className="bg-emerald-100 p-1.5 rounded-full">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
            ) : (
              <div className="bg-rose-100 p-1.5 rounded-full">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
            )}
            <Badge
              variant={regulatorCorrect ? "default" : "destructive"}
              className={regulatorCorrect ? "bg-emerald-600" : ""}
            >
              {regulatorCorrect ? "Verified Correct" : "Audit Discrepancy"}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold">
            Decision Analysis
          </DialogTitle>
          <DialogDescription className="text-base">{message}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#005D9F]">The Claim</h3>
              <Badge variant="outline" className="bg-white border-blue-200">
                Submitted
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground mr-2">Name:</span>
                <span className="font-medium">{claim.claimant_name}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground mr-2">Weight:</span>
                <span className="font-medium">{claim.gold_weight_kg} kg</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground mr-2">Date:</span>
                <span className="font-medium">{claim.claimed_date}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground mr-2">Location:</span>
                <span className="font-medium">{claim.claimed_location}</span>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-100/50">
              <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold mb-1">
                Narrative Pitch
              </p>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "{claim.narrative}"
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border ${ledgerTransaction ? "border-emerald-100 bg-emerald-50/30" : "border-rose-100 bg-rose-50/30"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                className={`font-bold ${ledgerTransaction ? "text-emerald-700" : "text-rose-700"}`}
              >
                The Ledger
              </h3>
              <Badge
                variant="outline"
                className={`bg-white ${ledgerTransaction ? "border-emerald-200" : "border-rose-200"}`}
              >
                Authority
              </Badge>
            </div>
            {ledgerTransaction ? (
              <div className="space-y-2">
                <p className="text-sm font-mono text-emerald-800 bg-emerald-100/50 px-2 py-1 rounded inline-block">
                  {ledgerTransaction.id}
                </p>
                <div className="space-y-1.5 mt-2">
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-muted-foreground w-16">Weight:</span>
                    <span
                      className={`font-medium ${basis?.matchedFields?.includes("gold_weight_kg") ? "text-emerald-700" : ""}`}
                    >
                      {ledgerTransaction.gold_weight_kg} kg
                      {basis?.matchedFields?.includes("gold_weight_kg") && (
                        <CheckCircle2 className="w-3 h-3 inline ml-1" />
                      )}
                    </span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-muted-foreground w-16">Date:</span>
                    <span
                      className={`font-medium ${basis?.matchedFields?.includes("date") ? "text-emerald-700" : ""}`}
                    >
                      {ledgerTransaction.date}
                      {basis?.matchedFields?.includes("date") && (
                        <CheckCircle2 className="w-3 h-3 inline ml-1" />
                      )}
                    </span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-muted-foreground w-16">
                      Location:
                    </span>
                    <span
                      className={`font-medium ${basis?.matchedFields?.includes("location") ? "text-emerald-700" : ""}`}
                    >
                      {ledgerTransaction.location}
                      {basis?.matchedFields?.includes("location") && (
                        <CheckCircle2 className="w-3 h-3 inline ml-1" />
                      )}
                    </span>
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-100/50">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold mb-1">
                    Matched Proof
                  </p>
                  <p className="text-xs text-emerald-800">
                    Authority record confirmed on immutabe ledger.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <Search className="w-8 h-8 text-rose-300 mb-2" />
                  <p className="text-sm text-rose-800 font-medium">
                    Null Record Found
                  </p>
                  <p className="text-xs text-rose-600/70 mt-1">
                    No matching entries exist for this claim profile.
                  </p>
                </div>

                {basis?.closestMatches?.length > 0 && (
                  <div className="mt-2 pt-3 border-t border-rose-100">
                    <p className="text-[10px] uppercase tracking-wider text-rose-400 font-bold mb-2">
                      Closest Ledger Matches
                    </p>
                    <div className="space-y-2">
                      {basis.closestMatches.map((m: any) => (
                        <div
                          key={m.id}
                          className="bg-white/50 p-2 rounded border border-rose-50 flex flex-col gap-1"
                        >
                          <span className="text-[10px] font-mono text-rose-700">
                            {m.id}
                          </span>
                          <div className="flex gap-1 flex-wrap">
                            {m.matches.map((match: string) => (
                              <Badge
                                key={match}
                                variant="secondary"
                                className="text-[8px] px-1 py-0 h-3 bg-rose-50 text-rose-600 border-rose-100"
                              >
                                {match}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 p-5 rounded-2xl bg-[#005D9F]/5 border border-blue-100">
          <p className="text-xs font-bold text-[#005D9F] uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1 h-3 bg-blue-600 rounded-full"></span>
            Regulatory Lesson
          </p>
          <p className="text-sm text-[#005D9F] leading-relaxed italic">
            "{explanation}"
          </p>
          <div className="mt-4 pt-4 border-t border-blue-100/50 flex flex-col gap-2">
            <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg border border-blue-50">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                Session Audit Hash
              </span>
              <code className="text-[10px] font-mono text-blue-600">
                {sessionHash?.substring(0, 16) || "N/A"}
              </code>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              "AI talks, documents persuade, but only the ledger decides."
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={() => window.location.reload()}
            className="w-full h-12 bg-[#005D9F] hover:bg-[#004a80] text-white rounded-xl font-bold shadow-lg shadow-blue-900/10"
          >
            Acknowledge & Continue
          </Button>
        </DialogFooter>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
