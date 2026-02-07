'use client'

import { useState } from 'react'
import { SAMPLE_CLAIMS } from '@/lib/game-state'
import GameContainer from '@/components/game-container'
import ClaimSelector from '@/components/claim-selector'

export default function Home() {
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-background text-foreground">
      {!selectedClaim ? (
        <ClaimSelector
          claims={SAMPLE_CLAIMS}
          onSelectClaim={setSelectedClaim}
        />
      ) : (
        <GameContainer
          claimId={selectedClaim}
          onReset={() => setSelectedClaim(null)}
        />
      )}
    </main>
  )
}
