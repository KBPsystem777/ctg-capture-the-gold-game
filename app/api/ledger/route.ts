import { getLedger, getLedgerHash } from '@/lib/ledger'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const transactions = getLedger()
    const hash = getLedgerHash()

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        hash,
        immutable: true,
        recordCount: transactions.length,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve ledger' },
      { status: 500 }
    )
  }
}
