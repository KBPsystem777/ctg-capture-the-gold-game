"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock } from "lucide-react";

interface LedgerTransaction {
  id: string;
  gold_weight_kg: number;
  date: string;
  location: string;
  status: string;
  seller: string;
  buyer: string;
}

export default function LedgerPanel() {
  const [ledger, setLedger] = useState<LedgerTransaction[]>([]);
  const [hash, setHash] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        // The server will resolve session from cookie or query param; use default behavior for now
        const response = await fetch("/api/ledger");
        const data = await response.json();
        if (data.success) {
          setLedger(data.data.transactions);
          setHash(data.data.hash);
        }
      } catch (error) {
        console.error("Failed to fetch ledger:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLedger();
  }, []);

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <CardTitle className="text-accent">Immutable Ledger</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Hash */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Ledger Hash (SHA-256)
              </p>
              <p className="text-xs font-mono text-muted-foreground break-all bg-secondary p-2 rounded">
                {hash.substring(0, 32)}...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Immutable proof of ledger integrity
              </p>
            </div>

            {/* Transactions */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Recorded Transactions ({ledger.length})
                </p>
                {/* Toggle on mobile */}
                <div className="md:hidden">
                  <button
                    onClick={() => setExpanded((s) => !s)}
                    className="text-sm text-primary underline"
                  >
                    {expanded ? "Hide" : "Inspect ledger"}
                  </button>
                </div>
              </div>

              <div
                className={`${expanded ? "block" : "hidden md:block"} space-y-3 max-h-96 overflow-y-auto`}
              >
                {ledger.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-secondary p-3 rounded border border-border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-mono text-xs font-bold text-primary">
                        {tx.id}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          tx.status === "confirmed"
                            ? "bg-green-900/30 text-green-100"
                            : "bg-yellow-900/30 text-yellow-100"
                        }`}
                      >
                        {tx.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-semibold text-foreground">
                          {tx.gold_weight_kg} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-semibold text-foreground">
                          {tx.date}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-semibold text-foreground">
                          {tx.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="border-t border-border pt-3 mt-3">
              <p className="text-xs text-muted-foreground">
                ⚠️ <strong>The ledger is your source of truth.</strong> Use it
                to verify if claims match recorded transactions.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
