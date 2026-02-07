import crypto from 'crypto'

export interface LedgerTransaction {
  id: string
  gold_weight_kg: number
  date: string
  location: string
  status: 'confirmed' | 'pending' | 'disputed'
  seller: string
  buyer: string
}

// Immutable ledger snapshot
const LEDGER_TRANSACTIONS: LedgerTransaction[] = [
  {
    id: 'TXN-2024-001',
    gold_weight_kg: 250,
    date: '2024-01-15',
    location: 'Manila Office',
    status: 'confirmed',
    seller: 'Aurelius Gold Trading',
    buyer: 'Central Bank of Philippines',
  },
  {
    id: 'TXN-2024-002',
    gold_weight_kg: 175,
    date: '2024-02-20',
    location: 'Singapore Vault',
    status: 'confirmed',
    seller: 'Pacific Resources Ltd',
    buyer: 'Central Bank of Philippines',
  },
  {
    id: 'TXN-2024-003',
    gold_weight_kg: 300,
    date: '2024-03-10',
    location: 'Hong Kong Exchange',
    status: 'confirmed',
    seller: 'Orient Metals Inc',
    buyer: 'Central Bank of Philippines',
  },
]

// Generate SHA-256 hash of ledger for immutability verification
export function getLedgerHash(): string {
  const ledgerString = JSON.stringify(LEDGER_TRANSACTIONS, null, 2)
  return crypto.createHash('sha256').update(ledgerString).digest('hex')
}

// Retrieve full ledger
export function getLedger(): LedgerTransaction[] {
  return LEDGER_TRANSACTIONS
}

// Verify if a transaction exists (by ID or partial matching)
export function verifyTransactionInList(
  transactions: LedgerTransaction[],
  goldWeight: number,
  date: string,
  location: string
): LedgerTransaction | null {
  return (
    transactions.find(
      (tx) =>
        tx.gold_weight_kg === goldWeight &&
        tx.date === date &&
        tx.location.toLowerCase().includes(location.toLowerCase())
    ) || null
  )
}

// Legacy verification against static ledger
export function verifyTransaction(
  goldWeight: number,
  date: string,
  location: string
): LedgerTransaction | null {
  return verifyTransactionInList(LEDGER_TRANSACTIONS, goldWeight, date, location)
}
