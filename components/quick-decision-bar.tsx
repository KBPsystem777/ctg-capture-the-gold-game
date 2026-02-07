"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";

interface QuickDecisionBarProps {
  onAction: (d: "approved" | "rejected") => void;
  loading?: boolean;
}

export default function QuickDecisionBar({
  onAction,
  loading = false,
}: QuickDecisionBarProps) {
  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-[60]">
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-blue-50/50 flex gap-3">
        <Button
          onClick={() => onAction("approved")}
          disabled={loading}
          className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-sm flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
          aria-label="Quick release payment"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" /> RELEASE
            </>
          )}
        </Button>
        <Button
          onClick={() => onAction("rejected")}
          disabled={loading}
          className="flex-1 h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl shadow-sm flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
          aria-label="Quick reject claim"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <X className="w-5 h-5" /> REJECT
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
