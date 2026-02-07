'use client';

import { GameClaim } from '@/lib/game-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ClaimSelectorProps {
  claims: GameClaim[]
  onSelectClaim: (claimId: string) => void
}

export default function ClaimSelector({
  claims,
  onSelectClaim,
}: ClaimSelectorProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">
            C2G: Capture the Gold
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Regulatory Simulation Game
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            You are a regulator reviewing claims for gold sale payments. Your task: verify claims
            against the immutable ledger. Trust is not established by confidence, documents, or
            AI — only by the ledger.
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-accent">Game Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-foreground">
            <p>
              1. Review the claim details and any documents provided by the claimant.
            </p>
            <p>
              2. Chat with the claimant representative to ask questions and seek clarification.
            </p>
            <p>
              3. Consult the immutable ledger to verify if the transaction actually occurred.
            </p>
            <p>
              4. Make your decision: approve or reject payment based on ledger truth, not persuasion.
            </p>
          </CardContent>
        </Card>

        {/* Claims */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Select a Claim to Review
          </h2>
          {claims.map((claim) => (
            <Card
              key={claim.id}
              className="bg-card border-border hover:border-primary transition-colors cursor-pointer"
              onClick={() => onSelectClaim(claim.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-accent">{claim.claimant_name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Claim ID: {claim.id}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectClaim(claim.id)
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Review Claim
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Gold Weight</p>
                    <p className="font-semibold text-foreground">{claim.gold_weight_kg} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Claimed Date</p>
                    <p className="font-semibold text-foreground">{claim.claimed_date}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">{claim.claimed_location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Documents</p>
                    <p className="font-semibold text-foreground">{claim.documents.length} files</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
