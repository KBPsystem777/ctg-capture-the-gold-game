'use client'

import { GameClaim } from '@/lib/game-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ClaimPanelProps {
  claim: GameClaim
}

export default function ClaimPanel({ claim }: ClaimPanelProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-accent">Claim Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Claimant */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Claimant</p>
          <p className="font-semibold text-foreground">{claim.claimant_name}</p>
        </div>

        {/* Gold Weight */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Gold Weight</p>
          <p className="text-2xl font-bold text-primary">{claim.gold_weight_kg} kg</p>
        </div>

        {/* Date */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Claimed Date</p>
          <p className="font-semibold text-foreground">{claim.claimed_date}</p>
        </div>

        {/* Location */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
          <p className="font-semibold text-foreground">{claim.claimed_location}</p>
        </div>

        {/* Narrative */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Narrative</p>
          <p className="text-sm text-foreground bg-secondary p-3 rounded">{claim.narrative}</p>
        </div>

        {/* Documents */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Documents</p>
          <div className="space-y-2">
            {claim.documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between bg-secondary p-2 rounded text-sm">
                <span className="text-foreground truncate">{doc.split('/').pop()}</span>
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                  Attached
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Key Risk Indicator */}
        <div className="border-t border-border pt-4 mt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Verification Status
          </p>
          <p className="text-sm text-muted-foreground">
            Cross-check these details against the ledger to verify authenticity.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
