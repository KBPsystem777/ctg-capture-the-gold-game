import { NextRequest, NextResponse } from 'next/server'
import { verifyTransaction } from '@/lib/ledger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { decision, claimId, goldWeight, claimDate, location } = body

    if (!decision || !['approved', 'rejected'].includes(decision)) {
      return NextResponse.json(
        { error: 'Invalid decision value' },
        { status: 400 }
      )
    }

    // Verify claim against ledger
    const ledgerMatch = verifyTransaction(goldWeight, claimDate, location)
    const isLedgerValid = ledgerMatch !== null

    // Determine if decision matches ledger truth
    const correctDecision = isLedgerValid ? 'approved' : 'rejected'
    const regulatorCorrect = decision === correctDecision

    return NextResponse.json({
      success: true,
      decision,
      claimId,
      ledgerMatch: {
        exists: isLedgerValid,
        transaction: ledgerMatch,
      },
      evaluation: {
        regulatorCorrect,
        message: regulatorCorrect
          ? 'Your decision aligns with the ledger record. Excellent regulatory judgment.'
          : `Your decision conflicts with the ledger. The claim was actually ${isLedgerValid ? 'VALID' : 'INVALID'}.`,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process decision' },
      { status: 500 }
    )
  }
}
