import { getLedger, getLedgerHash } from '@/lib/ledger'
import { getSession } from '@/lib/session-ledger'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const sessionParam = url.searchParams.get('session')
    let transactions = getLedger()
    let hash = getLedgerHash()

    // Try session by query param first
    if (sessionParam) {
      const s = getSession(sessionParam)
      if (s) {
        transactions = s.transactions
        hash = s.hash
      }
    } else {
      // Try cookie
      const cookieSession = request.cookies.get('ctg_session')?.value
      if (cookieSession) {
        const s = getSession(cookieSession)
        if (s) {
          transactions = s.transactions
          hash = s.hash
        }
      }
    }

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
