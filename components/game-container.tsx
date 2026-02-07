'use client'

import { useState, useEffect } from 'react'
import { SAMPLE_CLAIMS } from '@/lib/game-state'
import LedgerPanel from './ledger-panel'
import ChatPanel from './chat-panel'
import ClaimPanel from './claim-panel'
import DecisionPanel from './decision-panel'
import { Button } from '@/components/ui/button'

interface GameContainerProps {
  claimId: string
  onReset: () => void
}

export default function GameContainer({ claimId, onReset }: GameContainerProps) {
  const claim = SAMPLE_CLAIMS.find((c) => c.id === claimId)
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [sessionHash, setSessionHash] = useState<string | null>(null)

  // Ensure a session exists for this play-through (server sets HttpOnly cookie)
  useEffect(() => {
    const createSession = async () => {
      try {
        const res = await fetch('/api/session', { method: 'POST' })
        const data = await res.json()
        if (data.success) setSessionHash(data.data.hash)
      } catch (e) {
        console.error('Failed to create session', e)
      }
    }
    createSession()
  }, [])

  if (!claim) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Claim Not Found</h1>
          <Button onClick={onReset} className="bg-primary hover:bg-primary/90">
            Back to Claims
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">C2G: Regulatory Desk</h1>
          <p className="text-muted-foreground text-sm mt-1">Claim: {claim.claimant_name}</p>
          {sessionHash && (
            <p className="text-xs text-muted-foreground mt-1">Ledger Hash: <span className="font-mono">{sessionHash.substring(0, 12)}...</span></p>
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

      {/* Main Grid - Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
        {/* Left Column: Claim & Documents */}
        <div className="md:col-span-1 space-y-4">
          <ClaimPanel claim={claim} />
        </div>

        {/* Middle Column: Chat */}
        <div className="md:col-span-1 space-y-4">
          <ChatPanel claim={claim} />
        </div>

        {/* Right Column: Ledger & Decision */}
        <div className="md:col-span-2 lg:col-span-1 space-y-4">
          <LedgerPanel />
          {!showResult && (
            <DecisionPanel
              claim={claim}
              onDecision={(d) => {
                setDecision(d)
                setShowResult(true)
              }}
            />
          )}
          {showResult && decision && (
            <DecisionPanel claim={claim} onDecision={setDecision} result={decision} />
          )}
        </div>
      </div>
    </div>
  )
}
