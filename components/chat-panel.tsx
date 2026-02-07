"use client";

import { useState, useRef, useEffect } from "react";
import { GameClaim, ChatMessage } from "@/lib/game-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

interface ChatPanelProps {
  claim: GameClaim;
}

export default function ChatPanel({ claim }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "claimant",
      content: `Hello. I am here representing ${claim.claimant_name} regarding our gold sale claim. How can I can proceed with claiming our gold payment?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "regulator",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          claim,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const claimantMessage: ChatMessage = {
          role: "claimant",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, claimantMessage]);
      } else {
        console.error("Chat error:", data.error);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border h-full flex flex-col shadow-sm">
      <CardHeader className="py-3 px-4 md:py-4 md:px-6">
        <CardTitle className="text-[#005D9F] text-lg md:text-xl">
          Chat with Claimant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 min-h-[350px] lg:min-h-0 h-[50dvh] lg:h-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "regulator" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "regulator"
                    ? "bg-[#005D9F] text-white rounded-tr-none shadow-sm"
                    : "bg-muted text-foreground rounded-tl-none border border-border/50 shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-3 rounded-2xl rounded-tl-none border border-border/50 flex items-center gap-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Claimant is typing
                </span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 pt-2 border-t border-border/50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Review documents or ask about their claim..."
            disabled={loading}
            className="flex-1 bg-muted/30 text-foreground placeholder-muted-foreground px-4 py-2.5 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 text-sm transition-all shadow-inner"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            size="icon"
            className="bg-[#005D9F] hover:bg-[#004a80] text-white rounded-full h-10 w-10 shrink-0 shadow-sm transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
